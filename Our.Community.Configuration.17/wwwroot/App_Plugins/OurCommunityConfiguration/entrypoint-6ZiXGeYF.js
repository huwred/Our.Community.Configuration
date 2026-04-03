import { UMB_AUTH_CONTEXT as i } from "@umbraco-cms/backoffice/auth";
import { UmbContextConsumerController as r } from "@umbraco-cms/backoffice/context-api";
import { c as s } from "./client.gen-BFRy1BVY.js";
const g = (o, e) => {
  new r(o, i, (n) => {
    if (!n) return;
    const t = n.getOpenApiConfiguration();
    s.setConfig({
      baseUrl: t.base,
      auth: t.token
    });
  });
}, C = (o, e) => {
};
export {
  g as onInit,
  C as onUnload
};
//# sourceMappingURL=entrypoint-6ZiXGeYF.js.map
