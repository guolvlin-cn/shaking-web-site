import type { InterviewFormat, InterviewItem, Quote } from '../../shared/types.js';
import { jsonParse, mutate, newId, queryRows, toBool, type DbRow } from './db.js';

export interface InterviewRow extends DbRow {
  id: string;
  title: string;
  media: string;
  event_date: string;
  format: InterviewFormat;
  gradient: string | null;
  external_link: string | null;
  quotes: string | null;
  sort_order: number;
  is_published: number;
}

export function interviewFromRow(r: InterviewRow): InterviewItem {
  return {
    id: r.id,
    title: r.title,
    media: r.media,
    date: r.event_date,
    format: r.format,
    gradient: r.gradient ?? undefined,
    externalLink: r.external_link ?? undefined,
    quotes: jsonParse<Quote[] | undefined>(r.quotes, undefined),
    sortOrder: r.sort_order,
    isPublished: toBool(r.is_published),
  };
}

export type InterviewInput = Omit<InterviewItem, 'id' | 'isPublished'> & { isPublished?: boolean; quotes?: unknown };

const BASE = 'SELECT * FROM interviews';
const ORDER = 'ORDER BY event_date DESC';
const COLS = 'title,media,event_date,format,gradient,external_link,quotes,sort_order,is_published';

function toParams(it: InterviewInput): unknown[] {
  return [
    it.title,
    it.media,
    it.date,
    it.format,
    it.gradient ?? null,
    it.externalLink ?? null,
    it.quotes ? JSON.stringify(it.quotes) : null,
    it.sortOrder ?? 0,
    it.isPublished === false ? 0 : 1,
  ];
}

export const interviewsRepo = {
  async listPublished(): Promise<InterviewItem[]> {
    const rows = await queryRows<InterviewRow>(`${BASE} WHERE is_published = TRUE ${ORDER}`);
    return rows.map(interviewFromRow);
  },
  async listAll(): Promise<InterviewItem[]> {
    const rows = await queryRows<InterviewRow>(`${BASE} ${ORDER}`);
    return rows.map(interviewFromRow);
  },
  async getById(id: string): Promise<InterviewItem | null> {
    const rows = await queryRows<InterviewRow>(`${BASE} WHERE id = ?`, [id]);
    return rows.length > 0 ? interviewFromRow(rows[0]) : null;
  },
  async create(input: InterviewInput): Promise<InterviewItem> {
    const id = newId('i');
    await mutate(`INSERT INTO interviews (id,${COLS}) VALUES (?,${COLS.split(',').map(() => '?').join(',')})`, [
      id,
      ...toParams(input),
    ]);
    return (await interviewsRepo.getById(id))!;
  },
  async update(id: string, input: InterviewInput): Promise<InterviewItem | null> {
    await mutate(`UPDATE interviews SET ${COLS.split(',').map((c) => `${c} = ?`).join(',')} WHERE id = ?`, [
      ...toParams(input),
      id,
    ]);
    return interviewsRepo.getById(id);
  },
  async remove(id: string): Promise<boolean> {
    const result = await mutate('DELETE FROM interviews WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
