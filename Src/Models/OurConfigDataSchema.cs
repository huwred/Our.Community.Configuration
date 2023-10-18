﻿using Newtonsoft.Json.Linq;
using NPoco;
using System.ComponentModel.DataAnnotations;
using Umbraco.Cms.Infrastructure.Persistence.DatabaseAnnotations;

namespace Our.Community.Configuration.Models
{
    /// <summary>
    /// NPoco Schema for OurConfig Table
    /// </summary>
    [TableName("OurConfig")]
    [ExplicitColumns]
    [PrimaryKey("Id", AutoIncrement = true)]
    public class OurConfigDataSchema
    {
        
        [PrimaryKeyColumn(AutoIncrement = true, IdentitySeed = 1)]
        [NPoco.Column("Id")]
        public int Id { get; set; }

        [NPoco.Column("Name")]
        [Required]
        [Length(50)]
        public string Name { get; set; }

        [NPoco.Column("StringValue")]
        public string Value { get; set; }

        [NPoco.Column("Label")]
        [Length(100)]
        public string Label { get; set; }

        [NPoco.Column("IsEncrypted")]
        public bool Encrypted { get; set; }

        [NPoco.Column("Group")]
        [Length(20)]
        public string Group { get; set; }

        [NPoco.Column("Type")]
        public int Type { get; set; }

        [NPoco.Column("Key")]
        public string Key { get; set; }

        [NPoco.Ignore]
        public JObject PropType { get; set; }
    }

    public enum VarType
    {
        String,
        Number,
        Bool,
        List
    }
}
