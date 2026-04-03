import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { html, nothing, css } from '@umbraco-cms/backoffice/external/lit';
import { customElement, state } from '@umbraco-cms/backoffice/external/lit';
import type { AddConfigModalData, AddConfigModalValue } from './add-config-modal.token.js';

@customElement('our-config-add-modal')
export class OurConfigAddModalElement extends UmbModalBaseElement<AddConfigModalData, AddConfigModalValue> {
  @state() private _name = '';
  @state() private _label = '';
  @state() private _value = '';
  @state() private _encrypted = false;
  @state() private _group = '';
  @state() private _type = 0;

  static override styles = css`
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

  #handleTypeChange(e: Event) {
    this._type = parseInt((e.target as HTMLSelectElement).value ?? '0');
    if (this._type !== 0) this._encrypted = false;
  }

  #handleSubmit() {
    if (!this._name.trim()) return;
    this.updateValue({
      name: this._name.trim(),
      label: this._label,
      value: this._value,
      encrypted: this._encrypted,
      group: this._group,
      type: this._type,
    });
    this._submitModal();
  }

  override render() {
    return html`
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
                @input=${(e: InputEvent) => { this._group = (e.target as HTMLInputElement).value; }}
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
                @input=${(e: InputEvent) => { this._name = (e.target as HTMLInputElement).value; }}
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
                @input=${(e: InputEvent) => { this._label = (e.target as HTMLInputElement).value; }}
              ></uui-input>
            </uui-form-layout-item>

            <uui-form-layout-item>
              <uui-label for="occ-type" slot="label">Type</uui-label>
              <span class="select-wrap">
                <select id="occ-type" @change=${this.#handleTypeChange}>
                  <option value="0" ?selected=${this._type === 0}>String</option>
                  <option value="1" ?selected=${this._type === 1}>Numeric</option>
                  <option value="2" ?selected=${this._type === 2}>Boolean</option>
                </select>
              </span>
            </uui-form-layout-item>

            ${this._type === 0 ? html`
              <uui-form-layout-item>
                <uui-label for="occ-encrypt" slot="label">Encrypt value</uui-label>
                <uui-toggle
                  id="occ-encrypt"
                  .checked=${this._encrypted}
                  label="Encrypt"
                  @change=${(e: Event) => { this._encrypted = (e.target as HTMLInputElement).checked; }}
                ></uui-toggle>
              </uui-form-layout-item>
            ` : nothing}
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
            @click=${this.#handleSubmit}
          >Save</uui-button>
        </div>
      </umb-body-layout>
    `;
  }
}

export default OurConfigAddModalElement;
