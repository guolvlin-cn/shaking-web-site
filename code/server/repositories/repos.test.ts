import { beforeEach, describe, expect, it, vi } from 'vitest';

// 拦截共享连接池，验证 repo 生成的 SQL 与参数
vi.mock('../db/pool.js', () => ({
  default: { query: vi.fn(), execute: vi.fn() },
}));

import pool from '../db/pool.js';
import { workFromRow, worksRepo } from './works.repo.js';
import { timelineFromRow } from './timeline.repo.js';
import { photoFromRow } from './photos.repo.js';
import { musicFromRow } from './music.repo.js';
import { varietyFromRow } from './variety.repo.js';
import { stageFromRow } from './stage.repo.js';
import { interviewFromRow } from './interviews.repo.js';
import { qaFromRow } from './qaKnowledge.repo.js';
import { auditFromRow } from './auditLog.repo.js';
import { adminUserFromRow } from './adminUser.repo.js';

const mockPool = pool as unknown as { query: ReturnType<typeof vi.fn>; execute: ReturnType<typeof vi.fn> };

beforeEach(() => {
  mockPool.query.mockReset();
  mockPool.execute.mockReset();
});

describe('行映射器 snake_case → camelCase', () => {
  it('workFromRow', () => {
    const w = workFromRow({
      id: 'w-1',
      title: '问心2',
      type: '电视剧',
      category: '都市医疗',
      release_date: '2025-11',
      cover_image: null,
      gradient: 'linear-gradient(...)',
      description: '简介',
      role: '林逸',
      platform: '腾讯视频',
      external_link: 'https://v.qq.com',
      status: '已播出',
      tags: JSON.stringify(['主演']),
      sort_order: 1,
      is_published: 1,
    } as never);
    expect(w).toMatchObject({
      id: 'w-1',
      releaseDate: '2025-11',
      externalLink: 'https://v.qq.com',
      tags: ['主演'],
      sortOrder: 1,
      isPublished: true,
    });
  });

  it('各实体映射器输出关键字段', () => {
    const tl = timelineFromRow({
      id: 'tl-1', event_date: '2020-05-30', title: '出道', description: null,
      category: '出道', related_works: JSON.stringify(['w-3']), image: null,
      gradient: null, importance: 5, sort_order: 0, is_published: 1,
    } as never);
    expect(tl).toMatchObject({ eventDate: '2020-05-30', relatedWorks: ['w-3'], importance: 5, isPublished: true });

    const ph = photoFromRow({
      id: 'p-1', url: '', thumbnail_url: null, webp_url: null, album: '写真',
      title: '大片', description: null, tags: null, taken_date: null, source: null,
      gradient: null, file_size: null, width: null, height: null, sort_order: 0, is_published: 1,
    } as never);
    expect(ph).toMatchObject({ album: '写真', isPublished: true });

    const mu = musicFromRow({
      id: 'm-1', title: 'Black Cupid', artist: '谢可寅', album: null, release_date: '2022-02-14',
      category: '原创单曲', tags: JSON.stringify(['原创']), gradient: null, external_link: null,
      sort_order: 0, is_published: 1,
    } as never);
    expect(mu).toMatchObject({ artist: '谢可寅', category: '原创单曲', tags: ['原创'] });

    const va = varietyFromRow({
      id: 'v-1', name: '青春有你2', year: '2020', platform: '爱奇艺', role: '选手',
      category: '选秀', gradient: null, external_link: null, sort_order: 0, is_published: 1,
    } as never);
    expect(va).toMatchObject({ name: '青春有你2', year: '2020' });

    const st = stageFromRow({
      id: 'st-1', event_date: '2024-01-01', name: '微博之夜', location: '北京',
      performance: '舞台', category: '颁奖典礼', gradient: null,
      photos: JSON.stringify(['a']), sort_order: 0, is_published: 1,
    } as never);
    expect(st).toMatchObject({ date: '2024-01-01', photos: ['a'] });

    const itv = interviewFromRow({
      id: 'i-1', title: '访谈', media: '新浪', event_date: '2024-03-15', format: '视频专访',
      gradient: null, external_link: null, quotes: null, sort_order: 0, is_published: 1,
    } as never);
    expect(itv).toMatchObject({ media: '新浪', format: '视频专访', date: '2024-03-15' });

    const qa = qaFromRow({
      id: 'qa-1', question: null, keywords: JSON.stringify(['是谁']), answer: '答案',
      category: 'general', source: '官方', is_active: 1,
    } as never);
    expect(qa).toMatchObject({ keywords: ['是谁'], isActive: true });

    const audit = auditFromRow({
      id: 'log-1', user_id: 'au-1', action: 'create', resource_type: 'works',
      resource_id: 'w-1', old_value: null, new_value: '{}', ip_address: '127.0.0.1',
      user_agent: 'test', created_at: '2026-01-01',
    } as never);
    expect(audit).toMatchObject({ userId: 'au-1', resourceType: 'works', createdAt: '2026-01-01' });

    const admin = adminUserFromRow({
      id: 'au-1', username: 'admin', password_hash: '$2b$10$abc', email: null,
      role: 'super_admin', last_login: null, is_active: 1,
    } as never);
    expect(admin).toMatchObject({ username: 'admin', role: 'super_admin', isActive: true });
  });
});

describe('worksRepo SQL 生成', () => {
  it('listPublished(type) 追加 type 过滤', async () => {
    mockPool.query.mockResolvedValue([[[]], []]);
    await worksRepo.listPublished('音乐');
    const [sql, params] = mockPool.query.mock.calls[0];
    expect(sql).toContain('WHERE is_published = TRUE AND type = ?');
    expect(params).toEqual(['音乐']);
  });

  it('listUpcoming 限定状态集合', async () => {
    mockPool.query.mockResolvedValue([[[]], []]);
    await worksRepo.listUpcoming();
    const [sql] = mockPool.query.mock.calls[0];
    expect(sql).toContain("status IN ('即将上线','筹备中','待官宣')");
  });

  it('create 使用 execute + 参数映射', async () => {
    mockPool.execute.mockResolvedValue([{ affectedRows: 1 }, []]);
    mockPool.query.mockResolvedValue([[[]], []]);
    await worksRepo.create({
      title: '新作品', type: '电影', status: '筹备中', isPublished: true,
    });
    const [sql, params] = mockPool.execute.mock.calls[0];
    expect(sql).toContain('INSERT INTO works');
    // params[0] 为自动生成的 id
    expect(String(params[0])).toMatch(/^w-/);
    expect(params.slice(1)).toEqual([
      '新作品', '电影', null, null, null, null, null, null, null, null,
      '筹备中', null, 0, 1,
    ]);
  });
});
