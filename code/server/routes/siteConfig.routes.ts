import { Router } from 'express';
import type { RequestHandler } from 'express';
import type { HeroSlide, QuickJumpSection, SiteDisplayConfig, SocialLink } from '../../shared/types.js';
import { siteConfigRepo } from '../repositories/siteConfig.repo.js';

const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const siteConfigRouter = Router();

/** 站点展示配置聚合：site_profile / social_links / hero_slides / quick_jump_sections / announcement */
siteConfigRouter.get(
  '/site-config',
  asyncHandler(async (_req, res) => {
    const [site, socialLinks, heroSlides, quickJumpSections, announcement] = await Promise.all([
      siteConfigRepo.getJson('site_profile', {
        name: 'Shaking Chloe',
        chineseName: '谢可寅',
        tagline: '',
        fans: '虎卫队',
        cheerColor: '可寅银',
      }),
      siteConfigRepo.getJson<SocialLink[]>('social_links', []),
      siteConfigRepo.getJson<HeroSlide[]>('hero_slides', []),
      siteConfigRepo.getJson<QuickJumpSection[]>('quick_jump_sections', []),
      siteConfigRepo.getJson<string>('announcement', ''),
    ]);
    const config: SiteDisplayConfig = { site, socialLinks, heroSlides, quickJumpSections, announcement };
    res.json(config);
  }),
);
