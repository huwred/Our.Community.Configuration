using System;
using System.Collections.Generic;
using System.Linq;
using Effortless.Net.Encryption;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Our.Community.Configuration.Interfaces;
using Our.Community.Configuration.Models;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Infrastructure.Scoping;


namespace Our.Community.Configuration.Service
{
    /// <summary>
    /// Provides a configuration service for reading and writing application settings
    /// stored in the Umbraco database. Values are cached in memory for performance
    /// and optionally encrypted using AES-256 encryption.
    /// </summary>
    /// <remarks>
    /// Implements <see cref="IOurConfiguration"/> and uses an <see cref="InMemoryCache"/>
    /// with a 360-second TTL. Encryption keys are derived from the Umbraco telemetry GUID
    /// configured in <see cref="GlobalSettings"/>.
    /// </remarks>
    public class OurConfigService : IOurConfiguration
    {
        private Dictionary<string, OurConfigDataSchema>? _values;
        private readonly string password;
        private readonly string iv;

        private readonly IScopeProvider _scopeProvider;
        private readonly ILogger _logger;

        /// <summary>
        /// Initializes a new instance of <see cref="OurConfigService"/>.
        /// </summary>
        /// <param name="scopeProvider">The Umbraco scope provider used to create database scopes.</param>
        /// <param name="logger">The logger instance for recording errors and diagnostics.</param>
        /// <param name="globalSettings">
        /// The Umbraco global settings. The telemetry <c>Id</c> GUID is used to derive
        /// the AES initialisation vector (IV) for encryption/decryption.
        /// </param>
        public OurConfigService(IScopeProvider scopeProvider,ILogger<OurConfigService> logger,IOptions<GlobalSettings> globalSettings)
        {
            _scopeProvider = scopeProvider;
            var settings = globalSettings.Value;
            _logger = logger;
            password =  "our.community.config";
            //use the telemetry guid to create iv
            iv = settings.Id.Replace("-","").Substring(0,16);
            RefreshCache();


        }
        /// <summary>
        /// Returns all configuration entries from the in-memory cache.
        /// The cache is refreshed before each call to ensure up-to-date values are returned.
        /// </summary>
        /// <returns>
        /// An <see cref="IEnumerable{T}"/> of <see cref="OurConfigDataSchema"/> representing
        /// all stored configuration entries. Returns an empty list if the cache is empty
        /// or an error occurs.
        /// </returns>
        public IEnumerable<OurConfigDataSchema> GetConfig()
        {
            RefreshCache();
            var config = new List<OurConfigDataSchema>();

            try
            {
                if (_values != null)
                    foreach (var item in _values)
                    {
                        var configitem = Get(item.Key);



                        if (configitem != null) config.Add(configitem);
                    }

                return config;
            }
            catch (Exception e)
            {
                _logger.LogError(e,"Error loading data");
                return config;
            }
        }

        /// <summary>
        /// Returns all configuration entries belonging to the specified group
        /// from the in-memory cache.
        /// The cache is refreshed before each call to ensure up-to-date values are returned.
        /// </summary>
        /// <param name="groupname">The group name to filter configuration entries by.</param>
        /// <returns>
        /// An <see cref="IEnumerable{T}"/> of <see cref="OurConfigDataSchema"/> whose
        /// <c>Group</c> property matches <paramref name="groupname"/>. Returns an empty
        /// list if no matching entries exist or an error occurs.
        /// </returns>
        public IEnumerable<OurConfigDataSchema> GetConfigByGroup(string groupname)
        {
            RefreshCache();
            var config = new List<OurConfigDataSchema>();

            try
            {
                if (_values != null)
                    foreach (var item in _values.Where(v => v.Value.Group == groupname))
                    {
                        var configitem = Get(item.Key);

                        if (configitem != null) config.Add(configitem);
                    }

                return config;
            }
            catch (Exception e)
            {
                _logger.LogError(e,"Error loading data for " + groupname);
                return config;
            }
        }

        /// <summary>
        /// Fetch a value from config dictionary cache
        /// </summary>
        /// <param name="fieldname">Name of variable to return</param>
        /// <returns>A <c>OurConfigDataSchema</c> record</returns>
        public OurConfigDataSchema Get(string fieldname)
        {
            if (_values == null) { RefreshCache(); }
            if (_values != null && _values.ContainsKey(fieldname))
                return _values[fieldname];
            return null;
        }

        /// <summary>
        /// Returns the typed value of a configuration entry from the cache.
        /// </summary>
        /// <param name="fieldname">The name of the configuration field to retrieve.</param>
        /// <returns>
        /// <list type="bullet">
        ///   <item><description>A <see cref="long"/> if the entry type is <c>1</c> (integer).</description></item>
        ///   <item><description>A <see cref="bool"/> if the entry type is <c>2</c> (boolean), evaluated as <c>true</c> when the stored value equals <c>"1"</c>.</description></item>
        ///   <item><description>A decrypted <see cref="string"/> if the entry is flagged as encrypted.</description></item>
        ///   <item><description>The raw <see cref="string"/> value for all other types.</description></item>
        ///   <item><description><c>null</c> if the field does not exist in the cache.</description></item>
        /// </list>
        /// </returns>
        public object Value(string fieldname)
        {
            if (_values == null) { RefreshCache(); }

            if (_values != null && _values.ContainsKey(fieldname))
            {
                switch (_values[fieldname].Type)
                {
                    case 1 : return Convert.ToInt64(_values[fieldname].Value);
                    case 2 : return _values[fieldname].Value == "1";
                    default :
                        return _values[fieldname].Encrypted 
                            ? Strings.Decrypt(_values[fieldname].Value, password,_values[fieldname].Key,iv,Bytes.KeySize.Size256,6) 
                            : _values[fieldname].Value;
                }
            }
            return null;
        }

        /// <summary>
        /// Returns a distinct list of all group names present in the configuration table.
        /// </summary>
        /// <returns>
        /// A <see cref="string"/> array of unique group names retrieved directly
        /// from the database.
        /// </returns>
        public string[] Groups()
        {
            using var scope = _scopeProvider.CreateScope(autoComplete: true);
            var database = scope.Database;
            var res = database.Query<OurConfigDataSchema>().ProjectTo(x => x.Group);
            return res.Distinct().ToArray();

        }

        /// <summary>
        /// Fetches the value of an encrypted string from the dictionary cache
        /// </summary>
        /// <param name="fieldname">Name of password field</param>
        /// <returns>Decrypted string</returns>
        public string GetDecryptedValue(string fieldname)
        {
            if (_values == null) { RefreshCache(); }

            if (_values != null && _values.ContainsKey(fieldname))
                return Strings.Decrypt(_values[fieldname].Value, password, _values[fieldname].Key, iv, Bytes.KeySize.Size256, 6);

            return string.Empty;
        }

        /// <summary>
        /// Updates a record in the config table
        /// (creates a new record if it doesn't exist)
        /// </summary>
        /// <param name="name">Name of value to store</param>
        /// <param name="value">Value to store</param>
        /// <param name="key">The per-field encryption key used when <paramref name="encrypted"/> is <c>true</c>.</param>
        /// <param name="encrypted">Flag to determine if value is encrypted</param>
        public void Update(string name, string value, string key, bool encrypted = false)
        {
            var config = new OurConfigDataSchema
            {
                Name = name,
                Value = value
            };

            if (encrypted)
            {
                try
                {

                    config.Value = Strings.Encrypt(value, password,key,iv,Bytes.KeySize.Size256,6);
                    config.Encrypted = true;
                }
                catch (Exception e)
                {
                    _logger.LogError(e,"Error encrypting");
                    throw;
                }


            }
            using var scope = _scopeProvider.CreateScope(autoComplete: true);
            var database = scope.Database;
            OurConfigDataSchema foundIt = database.Single<OurConfigDataSchema>($"WHERE Name='{name}'");
            if (foundIt != null)
            {

                if (foundIt.Value != config.Value)
                {
                    foundIt.Value = config.Value;
                    database.Update(foundIt);
                }
            }
            else
            {
                database.Insert(config);
            }


        }

        /// <summary>
        /// Adds a new record to the database.
        /// If the <see cref="OurConfigDataSchema.Encrypted"/> flag is set and the value is not
        /// empty, the value is encrypted using AES-256 before being persisted.
        /// The in-memory cache is refreshed after the insert.
        /// </summary>
        /// <param name="newconfig">The <see cref="OurConfigDataSchema"/> record to insert.</param>
        public void Create(OurConfigDataSchema newconfig)
        {

            if (newconfig.Encrypted)
            {
                if (!String.IsNullOrWhiteSpace(newconfig.Value))
                    newconfig.Value = Strings.Encrypt(newconfig.Value.ToString(),password,newconfig.Key,iv,Bytes.KeySize.Size256,6);
            }
            using var scope = _scopeProvider.CreateScope(autoComplete: true);
            var database = scope.Database;
            database.Insert(newconfig);
            //reset the Values dictionary so it gets refreshed on next access
            RefreshCache(true);
        }

        /// <summary>
        /// Delete a Config variable
        /// </summary>
        /// <param name="fieldname">Name of variable to delete</param>
        public void Delete(string fieldname)
        {
            _values = null;
            using var scope = _scopeProvider.CreateScope(autoComplete: true);
            var database = scope.Database;
            database.Delete<OurConfigDataSchema>($"WHERE Name='{fieldname}'");
            RefreshCache(true);
        }

        /// <summary>
        /// Refresh the Config settings from the Database
        /// </summary>
        /// <param name="refresh">
        /// When <c>true</c>, forces the existing cached values and the
        /// <see cref="InMemoryCache"/> entry to be cleared before repopulating.
        /// When <c>false</c> (default), the cache is only populated if it has not
        /// already been loaded.
        /// </param>
        public void RefreshCache(bool refresh = false)
        {
            var cacheService = new InMemoryCache(360);

            if (refresh)
            {
                //remove if already exists
                _values = null;
                cacheService.Remove("our.config");
            }
            _values ??= cacheService.GetOrSet("our.config", GetValues);
        }

        /// <summary>
        /// Fetch a Dictionary of all the config values from the database to store in Cache
        /// </summary>
        /// <returns>
        /// A <see cref="Dictionary{TKey,TValue}"/> keyed by each entry's <c>Alias</c>,
        /// containing the corresponding <see cref="OurConfigDataSchema"/> record.
        /// Encrypted values are decrypted in-place before being stored in the dictionary.
        /// Any entry that fails decryption is still added with its raw (undecrypted) value;
        /// the error is logged via <see cref="ILogger"/>.
        /// </returns>
        private Dictionary<string, OurConfigDataSchema> GetValues()
        {
            Dictionary<string, OurConfigDataSchema> values = new Dictionary<string, OurConfigDataSchema>();
            using var scope = _scopeProvider.CreateScope(autoComplete: true);
            var database = scope.Database;
            var result = database.Query<OurConfigDataSchema>().ToList();
            foreach (OurConfigDataSchema item in result)
            {
                try
                {
                    if (item is { Encrypted: true } && !string.IsNullOrWhiteSpace(item.Value))
                    {
                        item.Value = Strings.Decrypt(item.Value, password,item.Key,iv,Bytes.KeySize.Size256,6);
                    }
                }
                catch (Exception e)
                {
                    _logger.LogError(e,"Error decrypting data");

                }
                values.Add(item.Alias, item);
            }
            return values;
        }
    }
}
