import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

vi.mock('../repositories/works.repo.js', () => ({ worksRepo: { listPublished: vi.fn(), getById: vi.fn() } }));
vi.mock('../repositories/timeline.repo.js', () => ({ timelineRepo: { listPublished: vi.fn(), getById: vi.fn() } }));
vi.mock('../repositories/photos.repo.js', () => ({ photosRepo: { listPublished: vi.fn(), getById: vi.fn() } }));
vi.mock('../repositories/music.repo.js', () => ({ musicRepo: { listPublished: vi.fn(), getById: vi.fn() } }));
vi.mock('../repositories/variety.repo.js', () => ({ varietyRepo: { listPublished: vi.fn(), getById: vi.fn() } }));
vi.mock('../repositories/stage.repo.js', () => ({ stageRepo: { listPublished: vi.fn(), getById: vi.fn() } }));
vi.mock('../repositories/interviews.repo.js', () => ({ interviewsRepo: { listPublished: vi.fn(), getById: vi.fn() } }));
vi.mock('../repositories/siteConfig.repo.js', () => ({ siteConfigRepo: { getJson: vi.fn() } }));
vi.mock('../services/chat.service.js', () => ({ answerQuestion: vi.fn() }));

import { createApp } from '../app.js';
import { worksRepo } from '../repositories/works.repo.js';
import { timelineRepo } from '../repositories/timeline.repo.js';
import { photosRepo } from '../repositories/photos.repo.js';
import { siteConfigRepo } from '../repositories/siteConfig.repo.js';
import { answerQuestion } from '../services/chat.service.js';

const app = createApp();

beforeEach(() => vi.clearAllMocks());

describe('GET /api/works', () => {
  it('返回作品列表', async () => {
    vi.mocked(worksRepo.listPublished).mockResolvedValue([
      { id: 'w-1', title: '问心2', type: '电视剧', status: '已播出', isPublished: true },
    ]);
    const res = await request(app).get('/api/works');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.items[0].title).toBe('问心2');
    expect(worksRepo.listPublished).toHaveBeenCalledWith(undefined);
  });

  it('type 过滤传参', async () => {
    vi.mocked(worksRepo.listPublished).mockResolvedValue([]);
    await request(app).get('/api/works?type=音乐');
    expect(worksRepo.listPublished).toHaveBeenCalledWith('音乐');
  });

  it('非法 type 返回 400', async () => {
    const res = await request(app).get('/api/works?type=xxx');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });

  it('不存在的作品返回 404', async () => {
    vi.mocked(worksRepo.getById).mockResolvedValue(null);
    const res = await request(app).get('/api/works/nope');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/timeline /api/photos', () => {
  it('timeline 列表（无过滤）', async () => {
    vi.mocked(timelineRepo.listPublished).mockResolvedValue([]);
    const res = await request(app).get('/api/timeline');
    expect(res.status).toBe(200);
    expect(timelineRepo.listPublished).toHaveBeenCalledWith(undefined);
  });

  it('photos 按 album 过滤', async () => {
    vi.mocked(photosRepo.listPublished).mockResolvedValue([]);
    await request(app).get('/api/photos?album=写真');
    expect(photosRepo.listPublished).toHaveBeenCalledWith('写真');
  });
});

describe('GET /api/site-config', () => {
  it('聚合站点配置', async () => {
    vi.mocked(siteConfigRepo.getJson).mockImplementation(async (key: string) =>
      key === 'site_profile' ? { name: 'Shaking Chloe', chineseName: '谢可寅', tagline: '', fans: '虎卫队', cheerColor: '可寅银' } : [],
    );
    const res = await request(app).get('/api/site-config');
    expect(res.status).toBe(200);
    expect(res.body.site.name).toBe('Shaking Chloe');
    expect(res.body.socialLinks).toEqual([]);
  });
});

describe('POST /api/chat', () => {
  it('有 question 时调用问答服务', async () => {
    vi.mocked(answerQuestion).mockResolvedValue({ answer: '答案', isFallback: true, fallbackType: 'matched' });
    const res = await request(app).post('/api/chat').send({ question: '谢可寅是谁' });
    expect(res.status).toBe(200);
    expect(res.body.answer).toBe('答案');
  });

  it('空 question 返回 400', async () => {
    const res = await request(app).post('/api/chat').send({ question: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });
});
