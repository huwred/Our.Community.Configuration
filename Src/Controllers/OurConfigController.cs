using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Our.Community.Configuration.Interfaces;
using Our.Community.Configuration.Models;
using Umbraco.Cms.Web.Common.Controllers;

namespace Our.Community.Configuration.Controllers
{
    /// <summary>
    /// Api Controller for backoffice config dashboard
    /// </summary>
    public class OurConfigController : UmbracoApiController
    {

        private readonly IOurConfiguration _ourConfig;

        public OurConfigController(IOurConfiguration ourConfig)
        {
            _ourConfig = ourConfig;
        }


        [HttpGet]
        public List<OurConfigDataSchema> Config()
        {
            return _ourConfig.GetConfig();
        }

        [HttpGet]
        public object Groups()
        {
            var groups = _ourConfig.Groups();
            return JsonConvert.SerializeObject(new ConfigGroups() { Groups = groups });
        }

        /// <summary>
        /// Adds a new config variable to the <paramref name="config"/>
        /// </summary>
        /// <param name="config"></param>
        [HttpPost]
        public List<OurConfigDataSchema> Create(OurConfigDataSchema config)
        {
            //strip Spaces from the name
            config.Name = config.Name.Replace(" ", "");
            //Generate a Key for encrypting
            config.Key = Guid.NewGuid().ToString();
            _ourConfig.Create(config);
            return _ourConfig.GetConfig();
        }

        /// <summary>
        /// Save config changes
        /// </summary>
        /// <param name="config"></param>
        [HttpPost]
        public void Update(IEnumerable<OurConfigDataSchema> config)
        {

            foreach (var item in config)
            {
                _ourConfig.Update(item.Name, item.Value,item.Key, item.Encrypted);
            }
            _ourConfig.RefreshCache(true);
        }

        [HttpPost]
        public void Delete(object fieldname)
        {
            _ourConfig.Delete(fieldname.ToString());
        }

        internal class ConfigGroups
        {
            public string[] Groups;
        }

    }
}