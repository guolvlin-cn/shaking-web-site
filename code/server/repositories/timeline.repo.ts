import type { TimelineCategory, TimelineEvent } from '../../shared/types.js';
import { jsonParse, mutate, newId, queryRows, toBool, type DbRow } from './db.js';

export interface TimelineRow extends DbRow {
  id: string;
  event_date: string;
  title: string;
  description: string | null;
  category: TimelineCategory;
  related_works: string | null;
  image: string | null;
  gradient: string | null;
  importance: number;
  sort_order: number;
  is_published: number;
}

export function timelineFromRow(r: TimelineRow): TimelineEvent {
  return {
    id: r.id,
    eventDate: r.event_date,
    title: r.title,
    description: r.description ?? undefined,
    category: r.category,
    relatedWorks: jsonParse<string[] | undefined>(r.related_works, undefined),
    image: r.image ?? undefined,
    gradient: r.gradient ?? undefined,
    importance: r.importance,
    isPublished: toBool(r.is_published),
  };
}

export type TimelineInput = Omit<TimelineEvent, 'id' | 'isPublished'> & { isPublished?: boolean };

const BASE = 'SELECT * FROM timeline_events';
const ORDER = 'ORDER BY event_date DESC, importance DESC';

const COLS = 'event_date,title,description,category,related_works,image,gradient,importance,sort_order,is_published';

function toParams(e: TimelineInput): unknown[] {
  return [
    e.eventDate,
    e.title,
    e.description ?? null,
    e.category,
    e.relatedWorks ? JSON.stringify(e.relatedWorks) : null,
    e.image ?? null,
    e.gradient ?? null,
    e.importance ?? 3,
    e.sortOrder ?? 0,
    e.isPublished === false ? 0 : 1,
  ];
}

export const timelineRepo = {
  async listPublished(category?: TimelineCategory): Promise<TimelineEvent[]> {
    const rows = category
      ? await queryRows<TimelineRow>(`${BASE} WHERE is_published = TRUE AND category = ? ${ORDER}`, [category])
      : await queryRows<TimelineRow>(`${BASE} WHERE is_published = TRUE ${ORDER}`);
    return rows.map(timelineFromRow);
  },

  async listAll(): Promise<TimelineEvent[]> {
    const rows = await queryRows<TimelineRow>(`${BASE} ${ORDER}`);
    return rows.map(timelineFromRow);
  },

  async getById(id: string): Promise<TimelineEvent | null> {
    const rows = await queryRows<TimelineRow>(`${BASE} WHERE id = ?`, [id]);
    return rows.length > 0 ? timelineFromRow(rows[0]) : null;
  },

  async create(input: TimelineInput): Promise<TimelineEvent> {
    const id = newId('tl');
    await mutate(`INSERT INTO timeline_events (id,${COLS}) VALUES (?,${COLS.split(',').map(() => '?').join(',')})`, [
      id,
      ...toParams(input),
    ]);
    return (await timelineRepo.getById(id))!;
  },

  async update(id: string, input: TimelineInput): Promise<TimelineEvent | null> {
    await mutate(`UPDATE timeline_events SET ${COLS.split(',').map((c) => `${c} = ?`).join(',')} WHERE id = ?`, [
      ...toParams(input),
      id,
    ]);
    return timelineRepo.getById(id);
  },

  async remove(id: string): Promise<boolean> {
    const result = await mutate('DELETE FROM timeline_events WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
