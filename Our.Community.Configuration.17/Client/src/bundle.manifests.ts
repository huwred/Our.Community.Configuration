import { manifests as entrypoints } from "./entrypoints/manifest.js";
import { manifests as dashboard } from "./dashboard/manifest.js";
import { manifests as modal } from "./modal/manifest.js";

// Job of the bundle is to collate all the manifests from different parts of the extension and load other manifests
// We load this bundle from umbraco-package.json
export const manifests: Array<UmbExtensionManifest> = [
  ...entrypoints,
  ...dashboard,
  ...modal,
];
