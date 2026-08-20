import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { WORKS } from './data/works';
import { SITE, SOCIAL_LINKS, HERO_SLIDES, QUICK_JUMP_SECTIONS } from './data/site';

const SITE_CONFIG = {
  site: SITE,
  socialLinks: SOCIAL_LINKS,
  heroSlides: HERO_SLIDES,
  quickJumpSections: QUICK_JUMP_SECTIONS,
  announcement: '',
};

// 路由骨架测试：mock 数据 hooks，避免真实网络请求
vi.mock('./hooks/useContentQueries', () => ({
  useWorks: () => ({ data: WORKS, isLoading: false, isError: false, refetch: vi.fn() }),
  useSiteConfig: () => ({ data: SITE_CONFIG, isLoading: false, isError: false, refetch: vi.fn() }),
  useChatAnswer: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

describe('App 路由骨架', () => {
  it('访问 / 渲染首页', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('page-home')).toBeInTheDocument();
  });

  it('访问 /about 渲染关于页', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('page-about')).toBeInTheDocument();
  });

  it('访问未知路径重定向到首页', async () => {
    render(
      <MemoryRouter initialEntries={['/not-exist']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('page-home')).toBeInTheDocument();
  });

  it('访问 /works 渲染作品合集页', async () => {
    render(
      <MemoryRouter initialEntries={['/works']}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('page-works')).toBeInTheDocument();
  });
});
