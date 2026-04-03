export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Our Community Configuration 17Entrypoint",
    alias: "Our.Community.Configuration._17.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
