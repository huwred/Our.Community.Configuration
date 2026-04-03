using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Our.Community.Configuration._17.Models;
using Our.Community.Configuration.Interfaces;
using Our.Community.Configuration.Models;

namespace Our.Community.Configuration._17.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "Our.Community.Configuration._17")]
    public class OurCommunityConfiguration17ApiController : OurCommunityConfiguration17ApiControllerBase
    {
        private readonly IOurConfiguration _config;

        public OurCommunityConfiguration17ApiController(IOurConfiguration config)
        {
            _config = config;
        }

        [HttpGet("ping")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        public string Ping() => "Pong";

        /// <summary>Returns all config entries.</summary>
        [HttpGet("config")]
        [ProducesResponseType<IEnumerable<ConfigItemModel>>(StatusCodes.Status200OK)]
        public IEnumerable<ConfigItemModel> GetConfig() =>
            _config.GetConfig().Select(ToModel);

        /// <summary>Returns the distinct group names.</summary>
        [HttpGet("groups")]
        [ProducesResponseType<string[]>(StatusCodes.Status200OK)]
        public string[] GetGroups() => _config.Groups();

        /// <summary>Creates a new config entry and returns the updated list.</summary>
        [HttpPost("config")]
        [ProducesResponseType<IEnumerable<ConfigItemModel>>(StatusCodes.Status200OK)]
        public IEnumerable<ConfigItemModel> CreateConfig([FromBody] CreateConfigRequest request)
        {
            var schema = new OurConfigDataSchema
            {
                Name = request.Name,
                Label = request.Label ?? string.Empty,
                Value = request.Value ?? string.Empty,
                Encrypted = request.Encrypted,
                Group = request.Group ?? string.Empty,
                Type = request.Type,
                Key = Guid.NewGuid().ToString(),
            };
            _config.Create(schema);
            return _config.GetConfig().Select(ToModel);
        }

        /// <summary>Saves changes to one or more config entries.</summary>
        [HttpPut("config")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult UpdateConfig([FromBody] IEnumerable<UpdateConfigRequest> items)
        {
            foreach (var item in items)
            {
                _config.Update(item.Name, item.Value ?? string.Empty, item.Key ?? string.Empty, item.Encrypted);
            }
            _config.RefreshCache(true);
            return NoContent();
        }

        /// <summary>Deletes a config entry by name.</summary>
        [HttpDelete("config/{name}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult DeleteConfig(string name)
        {
            _config.Delete(name);
            return NoContent();
        }

        private static ConfigItemModel ToModel(OurConfigDataSchema s) =>
            new(s.Id, s.Name, s.Alias, s.Value, s.Label, s.Encrypted, s.Group, s.Type, s.Key);
    }
}

