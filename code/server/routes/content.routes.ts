import { Router } from 'express';
import type { RequestHandler } from 'express';
import type { PhotoAlbum, TimelineCategory, WorkType } from '../../shared/types.js';
import { worksRepo } from '../repositories/works.repo.js';
import { timelineRepo } from '../repositories/timeline.repo.js';
import { photosRepo } from '../repositories/photos.repo.js';
import { musicRepo } from '../repositories/music.repo.js';
import { varietyRepo } from '../repositories/variety.repo.js';
import { stageRepo } from '../repositories/stage.repo.js';
import { interviewsRepo } from '../repositories/interviews.repo.js';

/** async 路由包装：统一把异常交给 errorHandler */
const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const toList = <T>(items: T[]) => ({ items, total: items.length });

const notFound = (resource: string) => ({ error: { message: `${resource}不存在`, code: 'NOT_FOUND' } });

export const contentRouter = Router();

// ---------- 作品 ----------
contentRouter.get(
  '/works',
  asyncHandler(async (req, res) => {
    const type = req.query.type as WorkType | undefined;
    const valid: WorkType[] = ['综艺', '电视剧', '电影', '音乐', '舞台'];
    if (type !== undefined && !valid.includes(type)) {
      res.status(400).json({ error: { message: 'type 参数不合法', code: 'BAD_REQUEST' } });
      return;
    }
    res.json(toList(await worksRepo.listPublished(type)));
  }),
);
contentRouter.get(
  '/works/:id',
  asyncHandler(async (req, res) => {
    const item = await worksRepo.getById(req.params.id);
    if (!item) res.status(404).json(notFound('作品'));
    else res.json(item);
  }),
);

// ---------- 时间线 ----------
contentRouter.get(
  '/timeline',
  asyncHandler(async (req, res) => {
    const category = req.query.category as TimelineCategory | undefined;
    res.json(toList(await timelineRepo.listPublished(category)));
  }),
);
contentRouter.get(
  '/timeline/:id',
  asyncHandler(async (req, res) => {
    const item = await timelineRepo.getById(req.params.id);
    if (!item) res.status(404).json(notFound('事件'));
    else res.json(item);
  }),
);

// ---------- 相册 ----------
contentRouter.get(
  '/photos',
  asyncHandler(async (req, res) => {
    const album = req.query.album as PhotoAlbum | undefined;
    res.json(toList(await photosRepo.listPublished(album)));
  }),
);
contentRouter.get(
  '/photos/:id',
  asyncHandler(async (req, res) => {
    const item = await photosRepo.getById(req.params.id);
    if (!item) res.status(404).json(notFound('图片'));
    else res.json(item);
  }),
);

// ---------- 音乐 / 综艺 / 舞台 / 采访 ----------
contentRouter.get('/music', asyncHandler(async (_req, res) => res.json(toList(await musicRepo.listPublished()))));
contentRouter.get('/music/:id', asyncHandler(async (req, res) => {
  const item = await musicRepo.getById(req.params.id);
  if (!item) res.status(404).json(notFound('音乐作品'));
  else res.json(item);
}));
contentRouter.get('/variety', asyncHandler(async (_req, res) => res.json(toList(await varietyRepo.listPublished()))));
contentRouter.get('/variety/:id', asyncHandler(async (req, res) => {
  const item = await varietyRepo.getById(req.params.id);
  if (!item) res.status(404).json(notFound('综艺'));
  else res.json(item);
}));
contentRouter.get('/stage', asyncHandler(async (_req, res) => res.json(toList(await stageRepo.listPublished()))));
contentRouter.get('/stage/:id', asyncHandler(async (req, res) => {
  const item = await stageRepo.getById(req.params.id);
  if (!item) res.status(404).json(notFound('舞台活动'));
  else res.json(item);
}));
contentRouter.get('/interviews', asyncHandler(async (_req, res) => res.json(toList(await interviewsRepo.listPublished()))));
contentRouter.get('/interviews/:id', asyncHandler(async (req, res) => {
  const item = await interviewsRepo.getById(req.params.id);
  if (!item) res.status(404).json(notFound('采访'));
  else res.json(item);
}));
