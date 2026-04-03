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
    public class OurConfigService : IOurConfiguration
    {
        private Dictionary<string, OurConfigDataSchema> _values;
        private readonly string password;
        private readonly string iv;

        private readonly IScopeProvider _scopeProvider;
        private readonly ILogger _logger;

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
        /// Cached Dictionary of Config values
        /// </summary>
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
                        return _values[fieldname].Encrypted ? Strings.Decrypt(_values[fieldname].Value, password,_values[fieldname].Key,iv,Bytes.KeySize.Size256,6) : _values[fieldname].Value;
                }
            }
            return null;
        }

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
                return _values[fieldname].Value;

            return string.Empty;
        }

        /// <summary>
        /// Updates a record in the config table
        /// (creates a new record if it doesn't exist)
        /// </summary>
        /// <param name="name">Name of value to store</param>
        /// <param name="value">Value to store</param>
        /// <param name="key"></param>
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
        /// Adds a new record to the database
        /// </summary>
        /// <param name="newconfig"></param>
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
        /// <param name="refresh"></param>
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
        /// <returns></returns>
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
