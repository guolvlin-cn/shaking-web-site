import type { Work, WorkStatus, WorkType } from '../../shared/types.js';
import { jsonParse, mutate, newId, queryRows, toBool, type DbRow } from './db.js';

export interface WorkRow extends DbRow {
  id: string;
  title: string;
  type: WorkType;
  category: string | null;
  release_date: string | null;
  cover_image: string | null;
  gradient: string | null;
  description: string | null;
  role: string | null;
  platform: string | null;
  external_link: string | null;
  status: WorkStatus;
  tags: string | null;
  sort_order: number;
  is_published: number;
}

export function workFromRow(r: WorkRow): Work {
  return {
    id: r.id,
    title: r.title,
    type: r.type,
    category: r.category ?? undefined,
    releaseDate: r.release_date ?? undefined,
    coverImage: r.cover_image ?? undefined,
    gradient: r.gradient ?? undefined,
    description: r.description ?? undefined,
    role: r.role ?? undefined,
    platform: r.platform ?? undefined,
    externalLink: r.external_link ?? undefined,
    status: r.status,
    tags: jsonParse<string[] | undefined>(r.tags, undefined),
    sortOrder: r.sort_order,
    isPublished: toBool(r.is_published),
  };
}

export type WorkInput = Omit<Work, 'id' | 'isPublished'> & { isPublished?: boolean };

const BASE = 'SELECT * FROM works';
const ORDER = 'ORDER BY sort_order ASC, release_date DESC';

function toParams(w: WorkInput): unknown[] {
  return [
    w.title,
    w.type,
    w.category ?? null,
    w.releaseDate ?? null,
    w.coverImage ?? null,
    w.gradient ?? null,
    w.description ?? null,
    w.role ?? null,
    w.platform ?? null,
    w.externalLink ?? null,
    w.status,
    w.tags ? JSON.stringify(w.tags) : null,
    w.sortOrder ?? 0,
    w.isPublished === false ? 0 : 1,
  ];
}

const COLS =
  'title,type,category,release_date,cover_image,gradient,description,role,platform,external_link,status,tags,sort_order,is_published';

export const worksRepo = {
  async listPublished(type?: WorkType): Promise<Work[]> {
    const rows = type
      ? await queryRows<WorkRow>(`${BASE} WHERE is_published = TRUE AND type = ? ${ORDER}`, [type])
      : await queryRows<WorkRow>(`${BASE} WHERE is_published = TRUE ${ORDER}`);
    return rows.map(workFromRow);
  },

  async listUpcoming(): Promise<Work[]> {
    const rows = await queryRows<WorkRow>(
      `${BASE} WHERE is_published = TRUE AND status IN ('即将上线','筹备中','待官宣') ${ORDER}`,
    );
    return rows.map(workFromRow);
  },

  async listAll(): Promise<Work[]> {
    const rows = await queryRows<WorkRow>(`${BASE} ${ORDER}`);
    return rows.map(workFromRow);
  },

  async getById(id: string): Promise<Work | null> {
    const rows = await queryRows<WorkRow>(`${BASE} WHERE id = ?`, [id]);
    return rows.length > 0 ? workFromRow(rows[0]) : null;
  },

  async create(input: WorkInput): Promise<Work> {
    const id = newId('w');
    await mutate(`INSERT INTO works (id,${COLS}) VALUES (?,${COLS.split(',').map(() => '?').join(',')})`, [
      id,
      ...toParams(input),
    ]);
    return (await worksRepo.getById(id))!;
  },

  async update(id: string, input: WorkInput): Promise<Work | null> {
    await mutate(`UPDATE works SET ${COLS.split(',').map((c) => `${c} = ?`).join(',')} WHERE id = ?`, [
      ...toParams(input),
      id,
    ]);
    return worksRepo.getById(id);
  },

  async remove(id: string): Promise<boolean> {
    const result = await mutate('DELETE FROM works WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
