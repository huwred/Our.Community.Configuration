const o = [
  {
    name: "Our Community Configuration 17Entrypoint",
    alias: "Our.Community.Configuration._17.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-6ZiXGeYF.js")
  }
], n = [
  {
    type: "dashboard",
    alias: "our.community.config.dashboard",
    name: "Community Configuration Dashboard",
    js: () => import("./config-dashboard.element-BBBJbkM5.js"),
    weight: -10,
    meta: {
      label: "Configuration",
      pathname: "community-config"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Settings"
      }
    ]
  }
], i = [
  {
    type: "modal",
    alias: "our.community.config.modal.add",
    name: "Add Config Property Modal",
    js: () => import("./add-config-modal.element-9V23vX-W.js")
  }
], t = [
  ...o,
  ...n,
  ...i
];
export {
  t as manifests
};
//# sourceMappingURL=our-community-configuration-17.js.map
