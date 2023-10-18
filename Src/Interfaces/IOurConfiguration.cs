using System.Collections.Generic;
using Our.Community.Configuration.Models;

namespace Our.Community.Configuration.Interfaces
{
    public interface IOurConfiguration
    {
        string[] Groups();

        /// <summary>
        /// 
        /// </summary>
        /// <param name="fieldname"></param>
        /// <returns></returns>
        OurConfigDataSchema Get(string fieldname);
        object Value(string fieldname);

        string GetDecryptedValue(string fieldname);

        List<OurConfigDataSchema> GetConfig();
        List<OurConfigDataSchema> GetConfigByGroup(string groupname);

        void Create(OurConfigDataSchema newconfig);
        void Update(string name, string value, string key, bool encrypted = false);
        void Delete(string fieldname);

        void RefreshCache(bool refresh = false);

    }
}
