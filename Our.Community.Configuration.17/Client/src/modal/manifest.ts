export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'modal',
    alias: 'our.community.config.modal.add',
    name: 'Add Config Property Modal',
    js: () => import('./add-config-modal.element.js'),
  },
];
