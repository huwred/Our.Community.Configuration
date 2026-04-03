import { client } from './client.gen.js';

const API_BASE = '/umbraco/ourcommunityconfiguration17/api/v1';

const BEARER: [{ scheme: 'bearer'; type: 'http' }] = [{ scheme: 'bearer', type: 'http' }];

export interface ConfigItem {
  id: number;
  name: string;
  alias: string;
  value: string | null;
  label: string | null;
  encrypted: boolean;
  group: string | null;
  type: number;
  key: string | null;
}

export interface CreateConfigRequest {
  name: string;
  label: string | null;
  value: string | null;
  encrypted: boolean;
  group: string | null;
  type: number;
}

export interface UpdateConfigRequest {
  name: string;
  value: string | null;
  key: string | null;
  encrypted: boolean;
}

export class ConfigService {
  /** Retrieves all config entries. */
  static getConfig() {
    return client.get<ConfigItem[], unknown, false>({
      url: `${API_BASE}/config`,
      security: BEARER,
    });
  }

  /** Returns the distinct group names. */
  static getGroups() {
    return client.get<string[], unknown, false>({
      url: `${API_BASE}/groups`,
      security: BEARER,
    });
  }

  /** Creates a new config entry and returns the updated full list. */
  static createConfig(request: CreateConfigRequest) {
    return client.post<ConfigItem[], unknown, false>({
      url: `${API_BASE}/config`,
      body: request,
      headers: { 'Content-Type': 'application/json' },
      security: BEARER,
    });
  }

  /** Saves changes to one or more config entries. */
  static updateConfig(items: UpdateConfigRequest[]) {
    return client.put<void, unknown, false>({
      url: `${API_BASE}/config`,
      body: items,
      headers: { 'Content-Type': 'application/json' },
      security: BEARER,
    });
  }

  /** Deletes a config entry by name. */
  static deleteConfig(name: string) {
    return client.delete<void, unknown, false>({
      url: `${API_BASE}/config/${encodeURIComponent(name)}`,
      security: BEARER,
    });
  }
}
