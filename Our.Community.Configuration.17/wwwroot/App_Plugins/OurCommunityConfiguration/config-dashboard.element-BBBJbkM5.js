import { UmbLitElement as D } from "@umbraco-cms/backoffice/lit-element";
import { UMB_NOTIFICATION_CONTEXT as I } from "@umbraco-cms/backoffice/notification";
import { UmbModalToken as T, UMB_MODAL_MANAGER_CONTEXT as M } from "@umbraco-cms/backoffice/modal";
import { html as n, nothing as $, css as P, state as m, customElement as S } from "@umbraco-cms/backoffice/external/lit";
import { c as p } from "./client.gen-BFRy1BVY.js";
const d = "/umbraco/ourcommunityconfiguration17/api/v1", h = [{ scheme: "bearer", type: "http" }];
class c {
  /** Retrieves all config entries. */
  static getConfig() {
    return p.get({
      url: `${d}/config`,
      security: h
    });
  }
  /** Returns the distinct group names. */
  static getGroups() {
    return p.get({
      url: `${d}/groups`,
      security: h
    });
  }
  /** Creates a new config entry and returns the updated full list. */
  static createConfig(e) {
    return p.post({
      url: `${d}/config`,
      body: e,
      headers: { "Content-Type": "application/json" },
      security: h
    });
  }
  /** Saves changes to one or more config entries. */
  static updateConfig(e) {
    return p.put({
      url: `${d}/config`,
      body: e,
      headers: { "Content-Type": "application/json" },
      security: h
    });
  }
  /** Deletes a config entry by name. */
  static deleteConfig(e) {
    return p.delete({
      url: `${d}/config/${encodeURIComponent(e)}`,
      security: h
    });
  }
}
const U = new T(
  "our.community.config.modal.add",
  { modal: { type: "sidebar", size: "small" } }
);
var N = Object.defineProperty, V = Object.getOwnPropertyDescriptor, w = (t) => {
  throw TypeError(t);
}, f = (t, e, a, o) => {
  for (var l = o > 1 ? void 0 : o ? V(e, a) : e, y = t.length - 1, v; y >= 0; y--)
    (v = t[y]) && (l = (o ? v(e, a, l) : v(l)) || l);
  return o && l && N(e, a, l), l;
}, R = (t, e, a) => e.has(t) || w("Cannot " + a), F = (t, e, a) => e.has(t) ? w("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, a), r = (t, e, a) => (R(t, e, "access private method"), a), i, g, b, C, x, k, A, O, s, _, z, E;
let u = class extends D {
  constructor() {
    super(...arguments), F(this, i), this._loading = !0, this._items = [], this._groups = [];
  }
  connectedCallback() {
    super.connectedCallback(), r(this, i, g).call(this);
  }
  render() {
    return this._loading ? n`<uui-loader-bar></uui-loader-bar>` : n`
      <uui-box class="header-box">
        <uui-button
          look="secondary"
          label="Add Property"
          @click=${r(this, i, O)}
        >
          <uui-icon name="icon-add"></uui-icon>
          Add Property
        </uui-button>
      </uui-box>

      ${this._groups.length === 0 ? n`
        <uui-box>
          <p class="empty-state">No settings defined. Use "Add Property" to create one.</p>
        </uui-box>
      ` : $}

      ${this._groups.map((t) => {
      const e = this._items.filter((a) => (a.group ?? "") === t);
      return n`
          <uui-box headline="${t || "Ungrouped"}">
            ${e.length === 0 ? n`<p class="empty-state">No items in this group.</p>` : e.map((a) => r(this, i, E).call(this, a))}
            <div class="group-save">
              <uui-button
                look="primary"
                label="Save group"
                @click=${() => r(this, i, k).call(this, t)}
              >Save group</uui-button>
            </div>
          </uui-box>
        `;
    })}
    `;
  }
};
i = /* @__PURE__ */ new WeakSet();
g = async function() {
  this._loading = !0;
  const [t, e] = await Promise.all([
    c.getConfig(),
    c.getGroups()
  ]);
  t.data && (this._items = t.data.map((a) => ({
    ...a,
    currentValue: a.value ?? ""
  }))), e.data && (this._groups = e.data), this._loading = !1;
};
b = function(t, e) {
  this._items = this._items.map(
    (a) => a.name === t ? { ...a, currentValue: e } : a
  );
};
C = function(t) {
  const e = this._items.find((a) => a.name === t);
  e && r(this, i, b).call(this, t, e.currentValue === "1" ? "0" : "1");
};
x = async function(t) {
  const e = this._items.find((o) => o.name === t);
  if (!e) return;
  (await c.updateConfig([r(this, i, _).call(this, e)])).error ? await r(this, i, s).call(this, "danger", `Failed to save "${t}"`) : await r(this, i, s).call(this, "positive", `"${t}" saved`);
};
k = async function(t) {
  const e = this._items.filter((o) => (o.group ?? "") === t).map((o) => r(this, i, _).call(this, o));
  (await c.updateConfig(e)).error ? await r(this, i, s).call(this, "danger", `Failed to save group "${t}"`) : await r(this, i, s).call(this, "positive", `Group "${t || "Ungrouped"}" saved`);
};
A = async function(t) {
  (await c.deleteConfig(t)).error ? await r(this, i, s).call(this, "danger", `Failed to delete "${t}"`) : (await r(this, i, s).call(this, "positive", `"${t}" deleted`), await r(this, i, g).call(this));
};
O = async function() {
  const t = await this.getContext(M);
  if (!t) {
    await r(this, i, s).call(this, "danger", "Modal manager not available");
    return;
  }
  const e = t.open(this, U, { data: {} });
  try {
    const a = await e.onSubmit();
    (await c.createConfig({
      name: a.name,
      label: a.label || null,
      value: a.value || null,
      encrypted: a.encrypted,
      group: a.group || null,
      type: a.type
    })).error ? await r(this, i, s).call(this, "danger", "Failed to create property") : (await r(this, i, s).call(this, "positive", `"${a.name}" created`), await r(this, i, g).call(this));
  } catch {
  }
};
s = async function(t, e) {
  const a = await this.getContext(I);
  a && a.peek(t, { data: { message: e } });
};
_ = function(t) {
  return {
    name: t.name,
    value: t.currentValue,
    key: t.key,
    encrypted: t.type === 0 && t.encrypted
  };
};
z = function(t) {
  return t.type === 1 ? "number" : t.encrypted ? "password" : "text";
};
E = function(t) {
  return n`
      <div class="property-row">
        <div class="property-label">
          <strong>${t.name} <small>(${t.alias})</small></strong>
          ${t.label ? n`<span>${t.label}</span>` : $}
        </div>
        <div class="property-editor">
          ${t.type === 2 ? n`
              <uui-toggle
                .checked=${t.currentValue === "1" || t.currentValue === "true"}
                label="${t.name}"
                @change=${() => r(this, i, C).call(this, t.name)}
              ></uui-toggle>
            ` : n`
              <uui-input
                type="${r(this, i, z).call(this, t)}"
                .value="${t.currentValue}"
                label="${t.name}"
                @input=${(e) => r(this, i, b).call(this, t.name, e.target.value)}
              ></uui-input>
            `}
        </div>
        <div class="property-actions">
          <uui-button
            compact
            look="secondary"
            label="Save ${t.name}"
            title="Save"
            @click=${() => r(this, i, x).call(this, t.name)}
          ><uui-icon name="icon-check"></uui-icon></uui-button>
          <uui-button
            compact
            look="secondary"
            color="danger"
            label="Delete ${t.name}"
            title="Delete"
            @click=${() => r(this, i, A).call(this, t.name)}
          ><uui-icon name="icon-trash"></uui-icon></uui-button>
        </div>
      </div>
    `;
};
u.styles = P`
    :host {
      display: block;
      padding: var(--uui-size-layout-1);
    }
    .header-box {
      margin-bottom: var(--uui-size-space-5);
    }
    uui-box {
      margin-bottom: var(--uui-size-space-5);
    }
    .property-row {
      display: flex;
      align-items: center;
      gap: var(--uui-size-space-3);
      padding: var(--uui-size-space-3) 0;
      border-bottom: 1px solid var(--uui-color-divider);
    }
    .property-row:last-child {
      border-bottom: none;
    }
    .property-label {
      flex: 0 0 220px;
    }
    .property-label strong {
      display: block;
      font-size: var(--uui-type-small-size);
    }
    .property-label span {
      display: block;
      font-size: var(--uui-type-small-size);
      color: var(--uui-color-text-alt);
    }
    .property-editor {
      flex: 1;
    }
    .property-editor uui-input {
      width: 100%;
    }
    .property-actions {
      display: flex;
      gap: var(--uui-size-space-2);
      flex-shrink: 0;
    }
    .group-save {
      margin-top: var(--uui-size-space-4);
      display: flex;
      justify-content: flex-end;
    }
    .empty-state {
      padding: var(--uui-size-space-5);
      color: var(--uui-color-text-alt);
      text-align: center;
    }
  `;
f([
  m()
], u.prototype, "_loading", 2);
f([
  m()
], u.prototype, "_items", 2);
f([
  m()
], u.prototype, "_groups", 2);
u = f([
  S("our-config-dashboard")
], u);
const X = u;
export {
  u as OurConfigDashboardElement,
  X as default
};
//# sourceMappingURL=config-dashboard.element-BBBJbkM5.js.map
