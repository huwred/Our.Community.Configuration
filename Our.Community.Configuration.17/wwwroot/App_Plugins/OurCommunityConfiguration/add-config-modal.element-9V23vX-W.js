import { UmbModalBaseElement as _ } from "@umbraco-cms/backoffice/modal";
import { nothing as b, html as c, css as v, state as o, customElement as f } from "@umbraco-cms/backoffice/external/lit";
var g = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, m = (e) => {
  throw TypeError(e);
}, l = (e, t, u, r) => {
  for (var i = r > 1 ? void 0 : r ? $(t, u) : t, n = e.length - 1, p; n >= 0; n--)
    (p = e[n]) && (i = (r ? p(t, u, i) : p(i)) || i);
  return r && i && g(t, u, i), i;
}, x = (e, t, u) => t.has(e) || m("Cannot " + u), E = (e, t, u) => t.has(e) ? m("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, u), d = (e, t, u) => (x(e, t, "access private method"), u), s, h, y;
let a = class extends _ {
  constructor() {
    super(...arguments), E(this, s), this._name = "", this._label = "", this._value = "", this._encrypted = !1, this._group = "", this._type = 0;
  }
  render() {
    return c`
      <umb-body-layout headline="Add Property">
        <uui-box>
          <uui-form>
            <uui-form-layout-item>
              <uui-label for="occ-group" slot="label">Group</uui-label>
              <uui-input
                id="occ-group"
                placeholder="Used to separate settings into sections"
                maxlength="20"
                .value=${this._group}
                @input=${(e) => {
      this._group = e.target.value;
    }}
              ></uui-input>
            </uui-form-layout-item>

            <uui-form-layout-item>
              <uui-label for="occ-name" slot="label">
                Name&nbsp;<sup style="color:var(--uui-color-danger-standalone)">*</sup>
              </uui-label>
              <uui-input
                id="occ-name"
                required
                placeholder="Enter a name..."
                maxlength="50"
                .value=${this._name}
                @input=${(e) => {
      this._name = e.target.value;
    }}
              ></uui-input>
              <small>An alias will be auto-generated from the name.</small>
            </uui-form-layout-item>

            <uui-form-layout-item>
              <uui-label for="occ-label" slot="label">Description</uui-label>
              <uui-input
                id="occ-label"
                placeholder="Enter a description..."
                maxlength="100"
                .value=${this._label}
                @input=${(e) => {
      this._label = e.target.value;
    }}
              ></uui-input>
            </uui-form-layout-item>

            <uui-form-layout-item>
              <uui-label for="occ-type" slot="label">Type</uui-label>
              <span class="select-wrap">
                <select id="occ-type" @change=${d(this, s, h)}>
                  <option value="0" ?selected=${this._type === 0}>String</option>
                  <option value="1" ?selected=${this._type === 1}>Numeric</option>
                  <option value="2" ?selected=${this._type === 2}>Boolean</option>
                </select>
              </span>
            </uui-form-layout-item>

            ${this._type === 0 ? c`
              <uui-form-layout-item>
                <uui-label for="occ-encrypt" slot="label">Encrypt value</uui-label>
                <uui-toggle
                  id="occ-encrypt"
                  .checked=${this._encrypted}
                  label="Encrypt"
                  @change=${(e) => {
      this._encrypted = e.target.checked;
    }}
                ></uui-toggle>
              </uui-form-layout-item>
            ` : b}
          </uui-form>
        </uui-box>

        <div slot="actions" class="actions">
          <uui-button
            look="secondary"
            label="Cancel"
            @click=${() => this._rejectModal()}
          >Cancel</uui-button>
          <uui-button
            look="primary"
            label="Save"
            ?disabled=${!this._name.trim()}
            @click=${d(this, s, y)}
          >Save</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
};
s = /* @__PURE__ */ new WeakSet();
h = function(e) {
  this._type = parseInt(e.target.value ?? "0"), this._type !== 0 && (this._encrypted = !1);
};
y = function() {
  this._name.trim() && (this.updateValue({
    name: this._name.trim(),
    label: this._label,
    value: this._value,
    encrypted: this._encrypted,
    group: this._group,
    type: this._type
  }), this._submitModal());
};
a.styles = v`
    uui-input,
    select {
      width: 100%;
    }
    .select-wrap {
      display: block;
    }
    select {
      height: var(--uui-size-11);
      padding: 0 var(--uui-size-3);
      border: 1px solid var(--uui-color-border);
      border-radius: var(--uui-border-radius);
      background: var(--uui-color-surface);
      color: var(--uui-color-text);
      font-size: var(--uui-type-small-size);
    }
    small {
      display: block;
      margin-top: var(--uui-size-1);
      color: var(--uui-color-text-alt);
    }
    .actions {
      display: flex;
      gap: var(--uui-size-4);
      justify-content: flex-end;
      padding: var(--uui-size-space-5);
    }
  `;
l([
  o()
], a.prototype, "_name", 2);
l([
  o()
], a.prototype, "_label", 2);
l([
  o()
], a.prototype, "_value", 2);
l([
  o()
], a.prototype, "_encrypted", 2);
l([
  o()
], a.prototype, "_group", 2);
l([
  o()
], a.prototype, "_type", 2);
a = l([
  f("our-config-add-modal")
], a);
const k = a;
export {
  a as OurConfigAddModalElement,
  k as default
};
//# sourceMappingURL=add-config-modal.element-9V23vX-W.js.map
