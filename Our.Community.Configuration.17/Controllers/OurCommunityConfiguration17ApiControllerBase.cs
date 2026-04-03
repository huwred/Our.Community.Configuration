using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace Our.Community.Configuration._17.Controllers
{
    [ApiController]
    [BackOfficeRoute("ourcommunityconfiguration17/api/v{version:apiVersion}")]
    [Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
    [MapToApi(Constants.ApiName)]
    public class OurCommunityConfiguration17ApiControllerBase : ControllerBase
    {
    }
}
