import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AddConfigModalData {}

export interface AddConfigModalValue {
  name: string;
  label: string;
  value: string;
  encrypted: boolean;
  group: string;
  type: number;
}

export const ADD_CONFIG_MODAL = new UmbModalToken<AddConfigModalData, AddConfigModalValue>(
  'our.community.config.modal.add',
  { modal: { type: 'sidebar', size: 'small' } },
);
