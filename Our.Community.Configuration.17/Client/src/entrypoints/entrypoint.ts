import type {
  UmbEntryPointOnInit,
  UmbEntryPointOnUnload,
} from "@umbraco-cms/backoffice/extension-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { UmbContextConsumerController } from "@umbraco-cms/backoffice/context-api";
import { client } from "../api/client.gen.js";

// load up the manifests here
export const onInit: UmbEntryPointOnInit = (host, _extensionRegistry) => {
  // Configure the hey-api client with Umbraco's backoffice auth token so that
  // all API calls made by ConfigService include a valid bearer token.
  new UmbContextConsumerController(host, UMB_AUTH_CONTEXT, (authContext) => {
    if (!authContext) return;
    const openApiConfig = authContext.getOpenApiConfiguration();
    client.setConfig({
      baseUrl: openApiConfig.base,
      auth: openApiConfig.token,
    });
  });
};

export const onUnload: UmbEntryPointOnUnload = (_host, _extensionRegistry) => {
  // nothing to clean up
};

