export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'dashboard',
    alias: 'our.community.config.dashboard',
    name: 'Community Configuration Dashboard',
    js: () => import('./config-dashboard.element.js'),
    weight: -10,
    meta: {
      label: 'Configuration',
      pathname: 'community-config',
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: 'Umb.Section.Settings',
      },
    ],
  },
];
