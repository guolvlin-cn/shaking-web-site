import type { MusicCategory, MusicWork } from '../../shared/types.js';
import { jsonParse, mutate, newId, queryRows, toBool, type DbRow } from './db.js';

export interface MusicRow extends DbRow {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  release_date: string | null;
  category: MusicCategory;
  tags: string | null;
  gradient: string | null;
  external_link: string | null;
  sort_order: number;
  is_published: number;
}

export function musicFromRow(r: MusicRow): MusicWork {
  return {
    id: r.id,
    title: r.title,
    artist: r.artist,
    album: r.album ?? undefined,
    releaseDate: r.release_date ?? undefined,
    category: r.category,
    tags: jsonParse<string[] | undefined>(r.tags, undefined),
    gradient: r.gradient ?? undefined,
    externalLink: r.external_link ?? undefined,
    sortOrder: r.sort_order,
    isPublished: toBool(r.is_published),
  };
}

export type MusicInput = Omit<MusicWork, 'id' | 'isPublished'> & { isPublished?: boolean };

const BASE = 'SELECT * FROM music_works';
const ORDER = 'ORDER BY sort_order ASC, release_date DESC';
const COLS = 'title,artist,album,release_date,category,tags,gradient,external_link,sort_order,is_published';

function toParams(m: MusicInput): unknown[] {
  return [
    m.title,
    m.artist,
    m.album ?? null,
    m.releaseDate ?? null,
    m.category,
    m.tags ? JSON.stringify(m.tags) : null,
    m.gradient ?? null,
    m.externalLink ?? null,
    m.sortOrder ?? 0,
    m.isPublished === false ? 0 : 1,
  ];
}

export const musicRepo = {
  async listPublished(): Promise<MusicWork[]> {
    const rows = await queryRows<MusicRow>(`${BASE} WHERE is_published = TRUE ${ORDER}`);
    return rows.map(musicFromRow);
  },
  async listAll(): Promise<MusicWork[]> {
    const rows = await queryRows<MusicRow>(`${BASE} ${ORDER}`);
    return rows.map(musicFromRow);
  },
  async getById(id: string): Promise<MusicWork | null> {
    const rows = await queryRows<MusicRow>(`${BASE} WHERE id = ?`, [id]);
    return rows.length > 0 ? musicFromRow(rows[0]) : null;
  },
  async create(input: MusicInput): Promise<MusicWork> {
    const id = newId('m');
    await mutate(`INSERT INTO music_works (id,${COLS}) VALUES (?,${COLS.split(',').map(() => '?').join(',')})`, [
      id,
      ...toParams(input),
    ]);
    return (await musicRepo.getById(id))!;
  },
  async update(id: string, input: MusicInput): Promise<MusicWork | null> {
    await mutate(`UPDATE music_works SET ${COLS.split(',').map((c) => `${c} = ?`).join(',')} WHERE id = ?`, [
      ...toParams(input),
      id,
    ]);
    return musicRepo.getById(id);
  },
  async remove(id: string): Promise<boolean> {
    const result = await mutate('DELETE FROM music_works WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
