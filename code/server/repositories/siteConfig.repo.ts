import type { SiteConfig } from '../../shared/types.js';
import { mutate, newId, queryRows, type DbRow } from './db.js';

export interface SiteConfigRow extends DbRow {
  id: string;
  config_key: string;
  config_value: string;
  description: string | null;
}

export function siteConfigFromRow(r: SiteConfigRow): SiteConfig {
  return {
    id: r.id,
    configKey: r.config_key,
    configValue: r.config_value,
    description: r.description ?? undefined,
  };
}

export const siteConfigRepo = {
  async getAll(): Promise<SiteConfig[]> {
    const rows = await queryRows<SiteConfigRow>('SELECT * FROM site_configs ORDER BY config_key ASC');
    return rows.map(siteConfigFromRow);
  },

  async getByKey(key: string): Promise<SiteConfig | null> {
    const rows = await queryRows<SiteConfigRow>('SELECT * FROM site_configs WHERE config_key = ?', [key]);
    return rows.length > 0 ? siteConfigFromRow(rows[0]) : null;
  },

  /** 读取并解析 JSON 值；key 不存在返回 fallback */
  async getJson<T>(key: string, fallback: T): Promise<T> {
    const row = await siteConfigRepo.getByKey(key);
    if (!row) return fallback;
    try {
      return JSON.parse(row.configValue) as T;
    } catch {
      return fallback;
    }
  },

  /** upsert：存在则更新，否则插入 */
  async set(key: string, value: string, description?: string): Promise<void> {
    const existing = await siteConfigRepo.getByKey(key);
    if (existing) {
      await mutate('UPDATE site_configs SET config_value = ?, description = COALESCE(?, description) WHERE config_key = ?', [
        value,
        description ?? null,
        key,
      ]);
    } else {
      await mutate('INSERT INTO site_configs (id, config_key, config_value, description) VALUES (?, ?, ?, ?)', [
        newId('cfg'),
        key,
        value,
        description ?? null,
      ]);
    }
  },
};
