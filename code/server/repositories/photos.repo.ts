import type { Photo, PhotoAlbum } from '../../shared/types.js';
import { jsonParse, mutate, newId, queryRows, toBool, type DbRow } from './db.js';

export interface PhotoRow extends DbRow {
  id: string;
  url: string;
  thumbnail_url: string | null;
  webp_url: string | null;
  album: PhotoAlbum;
  title: string;
  description: string | null;
  tags: string | null;
  taken_date: string | null;
  source: string | null;
  gradient: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_published: number;
}

export function photoFromRow(r: PhotoRow): Photo {
  return {
    id: r.id,
    url: r.url,
    thumbnailUrl: r.thumbnail_url ?? undefined,
    album: r.album,
    title: r.title,
    description: r.description ?? undefined,
    tags: jsonParse<string[] | undefined>(r.tags, undefined),
    takenDate: r.taken_date ?? undefined,
    source: r.source ?? undefined,
    gradient: r.gradient ?? undefined,
    sortOrder: r.sort_order,
    isPublished: toBool(r.is_published),
  };
}

export type PhotoInput = Omit<Photo, 'id' | 'isPublished'> & { isPublished?: boolean };

const BASE = 'SELECT * FROM photos';
const ORDER = 'ORDER BY album ASC, sort_order ASC, taken_date DESC';

const COLS =
  'url,thumbnail_url,webp_url,album,title,description,tags,taken_date,source,gradient,file_size,width,height,sort_order,is_published';

function toParams(p: PhotoInput): unknown[] {
  return [
    p.url,
    p.thumbnailUrl ?? null,
    undefined, // webp_url 由 OSS 处理链生成
    p.album,
    p.title,
    p.description ?? null,
    p.tags ? JSON.stringify(p.tags) : null,
    p.takenDate ?? null,
    p.source ?? null,
    p.gradient ?? null,
    null, // file_size
    null, // width
    null, // height
    p.sortOrder ?? 0,
    p.isPublished === false ? 0 : 1,
  ];
}

export const photosRepo = {
  async listPublished(album?: PhotoAlbum): Promise<Photo[]> {
    const rows = album
      ? await queryRows<PhotoRow>(`${BASE} WHERE is_published = TRUE AND album = ? ${ORDER}`, [album])
      : await queryRows<PhotoRow>(`${BASE} WHERE is_published = TRUE ${ORDER}`);
    return rows.map(photoFromRow);
  },

  async listAll(): Promise<Photo[]> {
    const rows = await queryRows<PhotoRow>(`${BASE} ${ORDER}`);
    return rows.map(photoFromRow);
  },

  async getById(id: string): Promise<Photo | null> {
    const rows = await queryRows<PhotoRow>(`${BASE} WHERE id = ?`, [id]);
    return rows.length > 0 ? photoFromRow(rows[0]) : null;
  },

  async create(input: PhotoInput): Promise<Photo> {
    const id = newId('p');
    await mutate(`INSERT INTO photos (id,${COLS}) VALUES (?,${COLS.split(',').map(() => '?').join(',')})`, [
      id,
      ...toParams(input),
    ]);
    return (await photosRepo.getById(id))!;
  },

  async update(id: string, input: PhotoInput): Promise<Photo | null> {
    await mutate(`UPDATE photos SET ${COLS.split(',').map((c) => `${c} = ?`).join(',')} WHERE id = ?`, [
      ...toParams(input),
      id,
    ]);
    return photosRepo.getById(id);
  },

  async remove(id: string): Promise<boolean> {
    const result = await mutate('DELETE FROM photos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
