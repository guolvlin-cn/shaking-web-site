import type { StageCategory, StageEvent } from '../../shared/types.js';
import { jsonParse, mutate, newId, queryRows, toBool, type DbRow } from './db.js';

export interface StageRow extends DbRow {
  id: string;
  event_date: string;
  name: string;
  location: string;
  performance: string | null;
  category: StageCategory;
  gradient: string | null;
  photos: string | null;
  sort_order: number;
  is_published: number;
}

export function stageFromRow(r: StageRow): StageEvent {
  return {
    id: r.id,
    date: r.event_date,
    name: r.name,
    location: r.location,
    performance: r.performance ?? undefined,
    category: r.category,
    gradient: r.gradient ?? undefined,
    photos: jsonParse<string[] | undefined>(r.photos, undefined),
    sortOrder: r.sort_order,
    isPublished: toBool(r.is_published),
  };
}

export type StageInput = Omit<StageEvent, 'id' | 'isPublished'> & { isPublished?: boolean };

const BASE = 'SELECT * FROM stage_events';
const ORDER = 'ORDER BY event_date DESC';
const COLS = 'event_date,name,location,performance,category,gradient,photos,sort_order,is_published';

function toParams(s: StageInput): unknown[] {
  return [
    s.date,
    s.name,
    s.location,
    s.performance ?? null,
    s.category,
    s.gradient ?? null,
    s.photos ? JSON.stringify(s.photos) : null,
    s.sortOrder ?? 0,
    s.isPublished === false ? 0 : 1,
  ];
}

export const stageRepo = {
  async listPublished(): Promise<StageEvent[]> {
    const rows = await queryRows<StageRow>(`${BASE} WHERE is_published = TRUE ${ORDER}`);
    return rows.map(stageFromRow);
  },
  async listAll(): Promise<StageEvent[]> {
    const rows = await queryRows<StageRow>(`${BASE} ${ORDER}`);
    return rows.map(stageFromRow);
  },
  async getById(id: string): Promise<StageEvent | null> {
    const rows = await queryRows<StageRow>(`${BASE} WHERE id = ?`, [id]);
    return rows.length > 0 ? stageFromRow(rows[0]) : null;
  },
  async create(input: StageInput): Promise<StageEvent> {
    const id = newId('st');
    await mutate(`INSERT INTO stage_events (id,${COLS}) VALUES (?,${COLS.split(',').map(() => '?').join(',')})`, [
      id,
      ...toParams(input),
    ]);
    return (await stageRepo.getById(id))!;
  },
  async update(id: string, input: StageInput): Promise<StageEvent | null> {
    await mutate(`UPDATE stage_events SET ${COLS.split(',').map((c) => `${c} = ?`).join(',')} WHERE id = ?`, [
      ...toParams(input),
      id,
    ]);
    return stageRepo.getById(id);
  },
  async remove(id: string): Promise<boolean> {
    const result = await mutate('DELETE FROM stage_events WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
