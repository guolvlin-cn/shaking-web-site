import type { VarietyCategory, VarietyShow } from '../../shared/types.js';
import { mutate, newId, queryRows, toBool, type DbRow } from './db.js';

export interface VarietyRow extends DbRow {
  id: string;
  name: string;
  year: string;
  platform: string;
  role: string;
  category: VarietyCategory;
  gradient: string | null;
  external_link: string | null;
  sort_order: number;
  is_published: number;
}

export function varietyFromRow(r: VarietyRow): VarietyShow {
  return {
    id: r.id,
    name: r.name,
    year: r.year,
    platform: r.platform,
    role: r.role,
    category: r.category,
    gradient: r.gradient ?? undefined,
    externalLink: r.external_link ?? undefined,
    sortOrder: r.sort_order,
    isPublished: toBool(r.is_published),
  };
}

export type VarietyInput = Omit<VarietyShow, 'id' | 'isPublished'> & { isPublished?: boolean };

const BASE = 'SELECT * FROM variety_shows';
const ORDER = 'ORDER BY year DESC, sort_order ASC';
const COLS = 'name,year,platform,role,category,gradient,external_link,sort_order,is_published';

function toParams(v: VarietyInput): unknown[] {
  return [
    v.name,
    v.year,
    v.platform,
    v.role,
    v.category,
    v.gradient ?? null,
    v.externalLink ?? null,
    v.sortOrder ?? 0,
    v.isPublished === false ? 0 : 1,
  ];
}

export const varietyRepo = {
  async listPublished(): Promise<VarietyShow[]> {
    const rows = await queryRows<VarietyRow>(`${BASE} WHERE is_published = TRUE ${ORDER}`);
    return rows.map(varietyFromRow);
  },
  async listAll(): Promise<VarietyShow[]> {
    const rows = await queryRows<VarietyRow>(`${BASE} ${ORDER}`);
    return rows.map(varietyFromRow);
  },
  async getById(id: string): Promise<VarietyShow | null> {
    const rows = await queryRows<VarietyRow>(`${BASE} WHERE id = ?`, [id]);
    return rows.length > 0 ? varietyFromRow(rows[0]) : null;
  },
  async create(input: VarietyInput): Promise<VarietyShow> {
    const id = newId('v');
    await mutate(`INSERT INTO variety_shows (id,${COLS}) VALUES (?,${COLS.split(',').map(() => '?').join(',')})`, [
      id,
      ...toParams(input),
    ]);
    return (await varietyRepo.getById(id))!;
  },
  async update(id: string, input: VarietyInput): Promise<VarietyShow | null> {
    await mutate(`UPDATE variety_shows SET ${COLS.split(',').map((c) => `${c} = ?`).join(',')} WHERE id = ?`, [
      ...toParams(input),
      id,
    ]);
    return varietyRepo.getById(id);
  },
  async remove(id: string): Promise<boolean> {
    const result = await mutate('DELETE FROM variety_shows WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
