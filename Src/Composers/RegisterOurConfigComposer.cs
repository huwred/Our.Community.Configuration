using Microsoft.Extensions.DependencyInjection;
using Our.Community.Configuration.Interfaces;
using Our.Community.Configuration.Service;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace Our.Community.Configuration.Composers;

public class RegisterOurConfigComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddScoped<IOurConfiguration, OurConfigService>();
    }
}