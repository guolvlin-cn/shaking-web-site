import { pathToFileURL } from 'node:url';
import bcrypt from 'bcryptjs';
import type { Pool } from 'mysql2/promise';
import pool from './pool.js';
import { env } from '../config/env.js';
// ---- mock 数据源（seed 迁入数据库；T7 前端移除静态数据后，这里是唯一种子来源）----
import { WORKS } from '../../src/data/works.js';
import { TIMELINE_EVENTS } from '../../src/data/timeline.js';
import { PHOTOS } from '../../src/data/photos.js';
import { MUSIC_WORKS } from '../../src/data/music.js';
import { VARIETY_SHOWS } from '../../src/data/variety.js';
import { STAGE_EVENTS } from '../../src/data/stage.js';
import { INTERVIEWS, QUOTES } from '../../src/data/interview.js';
import { FAQ } from '../../src/data/faq.js';
import { SITE, SOCIAL_LINKS, HERO_SLIDES, QUICK_JUMP_SECTIONS } from '../../src/data/site.js';

type Queryable = Pick<Pool, 'query'>;

// ============================================
// 行构建器：mock 数据 → DB 行（snake_case，JSON 序列化）
// 独立导出以便单元测试（不依赖真实连接）
// ============================================

export function buildWorkRows(): Record<string, unknown>[] {
  return WORKS.map((w) => ({
    id: w.id,
    title: w.title,
    type: w.type,
    category: w.category ?? null,
    release_date: w.releaseDate ?? null,
    cover_image: w.coverImage ?? null,
    gradient: w.gradient ?? null,
    description: w.description ?? null,
    role: w.role ?? null,
    platform: w.platform ?? null,
    external_link: w.externalLink ?? null,
    status: w.status,
    tags: w.tags ? JSON.stringify(w.tags) : null,
    sort_order: w.sortOrder ?? 0,
    is_published: w.isPublished ? 1 : 0,
  }));
}

export function buildTimelineRows(): Record<string, unknown>[] {
  return TIMELINE_EVENTS.map((e) => ({
    id: e.id,
    event_date: e.eventDate,
    title: e.title,
    description: e.description ?? null,
    category: e.category,
    related_works: e.relatedWorks ? JSON.stringify(e.relatedWorks) : null,
    image: e.image ?? null,
    gradient: e.gradient ?? null,
    importance: e.importance ?? 3,
    sort_order: 0,
    is_published: 1,
  }));
}

export function buildPhotoRows(): Record<string, unknown>[] {
  return PHOTOS.map((p) => ({
    id: p.id,
    url: p.url ?? '',
    thumbnail_url: null,
    webp_url: null,
    album: p.album,
    title: p.title,
    description: null,
    tags: p.tags ? JSON.stringify(p.tags) : null,
    taken_date: null,
    source: null,
    gradient: p.gradient ?? null,
    file_size: null,
    width: null,
    height: null,
    sort_order: 0,
    is_published: 1,
  }));
}

export function buildMusicRows(): Record<string, unknown>[] {
  return MUSIC_WORKS.map((m) => ({
    id: m.id,
    title: m.title,
    artist: m.artist,
    album: m.album ?? null,
    release_date: m.releaseDate ?? null,
    category: m.category,
    tags: m.tags ? JSON.stringify(m.tags) : null,
    gradient: m.gradient ?? null,
    external_link: m.externalLink ?? null,
    sort_order: 0,
    is_published: 1,
  }));
}

export function buildVarietyRows(): Record<string, unknown>[] {
  return VARIETY_SHOWS.map((v) => ({
    id: v.id,
    name: v.name,
    year: v.year,
    platform: v.platform,
    role: v.role,
    category: v.category,
    gradient: v.gradient ?? null,
    external_link: v.externalLink ?? null,
    sort_order: 0,
    is_published: 1,
  }));
}

export function buildStageRows(): Record<string, unknown>[] {
  return STAGE_EVENTS.map((s) => ({
    id: s.id,
    event_date: s.date,
    name: s.name,
    location: s.location,
    performance: s.performance ?? null,
    category: s.category,
    gradient: s.gradient ?? null,
    photos: s.photos ? JSON.stringify(s.photos) : null,
    sort_order: 0,
    is_published: 1,
  }));
}

export function buildInterviewRows(): Record<string, unknown>[] {
  return INTERVIEWS.map((it) => ({
    id: it.id,
    title: it.title,
    media: it.media,
    event_date: it.date,
    format: it.format,
    gradient: it.gradient ?? null,
    external_link: it.externalLink ?? null,
    quotes: QUOTES.length ? JSON.stringify(QUOTES) : null,
    sort_order: 0,
    is_published: 1,
  }));
}

export function buildFaqRows(): Record<string, unknown>[] {
  return FAQ.map((f, i) => ({
    id: `qa-${String(i + 1).padStart(3, '0')}`,
    question: null,
    keywords: JSON.stringify(f.keywords),
    answer: f.answer,
    category: 'general',
    source: f.source,
    is_active: 1,
  }));
}

export function buildSiteConfigRows(): Record<string, unknown>[] {
  return [
    { config_key: 'site_profile', config_value: JSON.stringify(SITE), description: '站点基础信息（名称/标语/粉丝名/应援色）' },
    { config_key: 'social_links', config_value: JSON.stringify(SOCIAL_LINKS), description: '社交媒体外链' },
    { config_key: 'hero_slides', config_value: JSON.stringify(HERO_SLIDES), description: '首页 Hero 轮播' },
    { config_key: 'quick_jump_sections', config_value: JSON.stringify(QUICK_JUMP_SECTIONS), description: '首页快捷入口区块' },
    { config_key: 'announcement', config_value: JSON.stringify(''), description: '网站公告' },
  ];
}

export async function buildAdminRows(): Promise<Record<string, unknown>[]> {
  const hash = await bcrypt.hash(env.admin.initialPassword, 10);
  return [
    {
      id: 'admin-001',
      username: env.admin.initialUsername,
      password_hash: hash,
      email: null,
      role: 'super_admin',
      is_active: 1,
    },
  ];
}

// ============================================
// 执行器
// ============================================

const INSERT_CONFIG: Array<{ table: string; columns: string; rows: Record<string, unknown>[] }> = [
  { table: 'works', columns: 'id,title,type,category,release_date,cover_image,gradient,description,role,platform,external_link,status,tags,sort_order,is_published', rows: buildWorkRows() },
  { table: 'timeline_events', columns: 'id,event_date,title,description,category,related_works,image,gradient,importance,sort_order,is_published', rows: buildTimelineRows() },
  { table: 'photos', columns: 'id,url,thumbnail_url,webp_url,album,title,description,tags,taken_date,source,gradient,file_size,width,height,sort_order,is_published', rows: buildPhotoRows() },
  { table: 'music_works', columns: 'id,title,artist,album,release_date,category,tags,gradient,external_link,sort_order,is_published', rows: buildMusicRows() },
  { table: 'variety_shows', columns: 'id,name,year,platform,role,category,gradient,external_link,sort_order,is_published', rows: buildVarietyRows() },
  { table: 'stage_events', columns: 'id,event_date,name,location,performance,category,gradient,photos,sort_order,is_published', rows: buildStageRows() },
  { table: 'interviews', columns: 'id,title,media,event_date,format,gradient,external_link,quotes,sort_order,is_published', rows: buildInterviewRows() },
  { table: 'qa_knowledge', columns: 'id,question,keywords,answer,category,source,is_active', rows: buildFaqRows() },
  { table: 'site_configs', columns: 'config_key,config_value,description', rows: buildSiteConfigRows() },
];

export async function runSeed(conn: Queryable = pool): Promise<void> {
  for (const { table, columns, rows } of INSERT_CONFIG) {
    await conn.query(`DELETE FROM ${table}`);
    if (rows.length > 0) {
      // mysql2 批量插入要求二维值数组（每行一个子数组），对象数组需展开为值列表
      const values = rows.map((r) => Object.values(r));
      await conn.query(`INSERT INTO ${table} (${columns}) VALUES ?`, [values]);
    }
    console.log(`[seed] ${table}: ${rows.length} rows`);
  }

  // 管理员：DELETE 后插入
  const adminRows = await buildAdminRows();
  await conn.query('DELETE FROM admin_users');
  await conn.query('INSERT INTO admin_users (id,username,password_hash,email,role,is_active) VALUES ?', [
    adminRows.map((r) => Object.values(r)),
  ]);
  console.log(`[seed] admin_users: ${adminRows.length} rows (${env.admin.initialUsername})`);
}

const isCli = process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url;
if (isCli) {
  runSeed()
    .then(() => {
      console.log('[seed] done');
      return pool.end();
    })
    .catch((err) => {
      console.error('[seed] failed:', err);
      process.exitCode = 1;
      return pool.end();
    });
}
