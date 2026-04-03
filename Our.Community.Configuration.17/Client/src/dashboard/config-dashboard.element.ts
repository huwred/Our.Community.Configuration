import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UMB_NOTIFICATION_CONTEXT } from '@umbraco-cms/backoffice/notification';
import { UMB_MODAL_MANAGER_CONTEXT } from '@umbraco-cms/backoffice/modal';
import { html, nothing, css } from '@umbraco-cms/backoffice/external/lit';
import { customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { ConfigService } from '../api/config.service.js';
import type { ConfigItem, UpdateConfigRequest } from '../api/config.service.js';
import { ADD_CONFIG_MODAL } from '../modal/add-config-modal.token.js';

interface DisplayItem extends ConfigItem {
  /** Locally edited value, used before saving. */
  currentValue: string;
}

@customElement('our-config-dashboard')
export class OurConfigDashboardElement extends UmbLitElement {
  @state() private _loading = true;
  @state() private _items: DisplayItem[] = [];
  @state() private _groups: string[] = [];

  static override styles = css`
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

  override connectedCallback() {
    super.connectedCallback();
    this.#loadData();
  }

  async #loadData() {
    this._loading = true;
    const [configResult, groupsResult] = await Promise.all([
      ConfigService.getConfig(),
      ConfigService.getGroups(),
    ]);

    if (configResult.data) {
      this._items = configResult.data.map(item => ({
        ...item,
        currentValue: item.value ?? '',
      }));
    }
    if (groupsResult.data) {
      this._groups = groupsResult.data;
    }
    this._loading = false;
  }

  #updateCurrentValue(name: string, value: string) {
    this._items = this._items.map(item =>
      item.name === name ? { ...item, currentValue: value } : item,
    );
  }

  #toggleBoolean(name: string) {
    const item = this._items.find(i => i.name === name);
    if (!item) return;
    this.#updateCurrentValue(name, item.currentValue === '1' ? '0' : '1');
  }

  async #saveItem(name: string) {
    const item = this._items.find(i => i.name === name);
    if (!item) return;
    const result = await ConfigService.updateConfig([this.#toUpdateRequest(item)]);
    if (result.error) {
      await this.#notify('danger', `Failed to save "${name}"`);
    } else {
      await this.#notify('positive', `"${name}" saved`);
    }
  }

  async #saveGroup(group: string) {
    const updates = this._items
      .filter(item => (item.group ?? '') === group)
      .map(item => this.#toUpdateRequest(item));

    const result = await ConfigService.updateConfig(updates);
    if (result.error) {
      await this.#notify('danger', `Failed to save group "${group}"`);
    } else {
      await this.#notify('positive', `Group "${group || 'Ungrouped'}" saved`);
    }
  }

  async #deleteItem(name: string) {
    const result = await ConfigService.deleteConfig(name);
    if (result.error) {
      await this.#notify('danger', `Failed to delete "${name}"`);
    } else {
      await this.#notify('positive', `"${name}" deleted`);
      await this.#loadData();
    }
  }

  async #openAddModal() {
    const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    if (!modalManager) {
      await this.#notify('danger', 'Modal manager not available');
      return;
    }
    
    const handler = modalManager.open(this, ADD_CONFIG_MODAL, { data: {} });
    try {
      const value = await handler.onSubmit();
      const result = await ConfigService.createConfig({
        name: value.name,
        label: value.label || null,
        value: value.value || null,
        encrypted: value.encrypted,
        group: value.group || null,
        type: value.type,
      });
      if (result.error) {
        await this.#notify('danger', 'Failed to create property');
      } else {
        await this.#notify('positive', `"${value.name}" created`);
        await this.#loadData();
      }
    } catch {
      // Modal was cancelled — no action needed
    }
  }

  async #notify(color: 'positive' | 'warning' | 'danger', message: string) {
    const ctx = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    if (!ctx) return;
    ctx.peek(color, { data: { message } });
  }

  #toUpdateRequest(item: DisplayItem): UpdateConfigRequest {
    return {
      name: item.name,
      value: item.currentValue,
      key: item.key,
      encrypted: item.type === 0 && item.encrypted,
    };
  }

  #getInputType(item: DisplayItem): string {
    if (item.type === 1) return 'number';
    if (item.encrypted) return 'password';
    return 'text';
  }

  override render() {
    if (this._loading) {
      return html`<uui-loader-bar></uui-loader-bar>`;
    }

    return html`
      <uui-box class="header-box">
        <uui-button
          look="secondary"
          label="Add Property"
          @click=${this.#openAddModal}
        >
          <uui-icon name="icon-add"></uui-icon>
          Add Property
        </uui-button>
      </uui-box>

      ${this._groups.length === 0 ? html`
        <uui-box>
          <p class="empty-state">No settings defined. Use "Add Property" to create one.</p>
        </uui-box>
      ` : nothing}

      ${this._groups.map(group => {
        const groupItems = this._items.filter(item => (item.group ?? '') === group);
        return html`
          <uui-box headline="${group || 'Ungrouped'}">
            ${groupItems.length === 0
              ? html`<p class="empty-state">No items in this group.</p>`
              : groupItems.map(item => this.#renderItem(item))}
            <div class="group-save">
              <uui-button
                look="primary"
                label="Save group"
                @click=${() => this.#saveGroup(group)}
              >Save group</uui-button>
            </div>
          </uui-box>
        `;
      })}
    `;
  }

  #renderItem(item: DisplayItem) {
    return html`
      <div class="property-row">
        <div class="property-label">
          <strong>${item.name} <small>(${item.alias})</small></strong>
          ${item.label ? html`<span>${item.label}</span>` : nothing}
        </div>
        <div class="property-editor">
          ${item.type === 2
            ? html`
              <uui-toggle
                .checked=${item.currentValue === '1' || item.currentValue === 'true'}
                label="${item.name}"
                @change=${() => this.#toggleBoolean(item.name)}
              ></uui-toggle>
            `
            : html`
              <uui-input
                type="${this.#getInputType(item)}"
                .value="${item.currentValue}"
                label="${item.name}"
                @input=${(e: InputEvent) =>
                  this.#updateCurrentValue(item.name, (e.target as HTMLInputElement).value)}
              ></uui-input>
            `}
        </div>
        <div class="property-actions">
          <uui-button
            compact
            look="secondary"
            label="Save ${item.name}"
            title="Save"
            @click=${() => this.#saveItem(item.name)}
          ><uui-icon name="icon-check"></uui-icon></uui-button>
          <uui-button
            compact
            look="secondary"
            color="danger"
            label="Delete ${item.name}"
            title="Delete"
            @click=${() => this.#deleteItem(item.name)}
          ><uui-icon name="icon-trash"></uui-icon></uui-button>
        </div>
      </div>
    `;
  }
}

export default OurConfigDashboardElement;
