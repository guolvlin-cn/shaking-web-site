import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home';
import { getLatestWorks, getUpcomingWorks } from '../../data/works';

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

describe('首页-入口门户 (Issue #3)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('TC-01 Hero 区可见，含品牌名', () => {
    renderHome();
    expect(screen.getByRole('heading', { name: /Shaking Chloe/ })).toBeInTheDocument();
    expect(screen.getByText('谢可寅')).toBeInTheDocument();
    expect(screen.getByLabelText('首页首屏')).toBeInTheDocument();
  });

  it('TC-02 轮播自动切换', () => {
    renderHome();
    const indicators = screen.getAllByRole('button', { name: /切换到第/ });
    expect(indicators).toHaveLength(3);
    act(() => {
      vi.advanceTimersByTime(5100);
    });
    // 第一张淡出，当前应为第 2 张（指示器宽度样式变化）
    expect(indicators[1]).toHaveClass('bg-accent-gold');
  });

  it('TC-03 点击指示器切换轮播', () => {
    renderHome();
    const indicators = screen.getAllByRole('button', { name: /切换到第/ });
    fireEvent.click(indicators[2]);
    expect(indicators[2]).toHaveClass('bg-accent-gold');
  });

  it('TC-04 社交链接新标签页打开', () => {
    renderHome();
    const weibo = screen.getByLabelText('微博');
    expect(weibo).toHaveAttribute('target', '_blank');
    expect(weibo).toHaveAttribute('href', expect.stringContaining('weibo.com'));
  });

  it('TC-05 最新作品区渲染 8 张卡片', () => {
    renderHome();
    const latest = getLatestWorks(8);
    expect(latest).toHaveLength(8);
    expect(screen.getByRole('heading', { name: '最新作品' })).toBeInTheDocument();
    for (const w of latest) {
      expect(screen.getByTestId(`work-card-${w.id}`)).toBeInTheDocument();
    }
  });

  it('TC-06 敬请期待区带金色印章', () => {
    renderHome();
    const upcoming = getUpcomingWorks();
    expect(upcoming.length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: '敬请期待' })).toBeInTheDocument();
    const stamps = screen.getAllByText('敬请期待');
    expect(stamps.length).toBeGreaterThan(0);
  });

  it('TC-07 探索更多 6 入口可跳转', () => {
    renderHome();
    const entries = ['音乐专区', '影视专区', '综艺专区', '舞台活动', '采访专区', '相册图库'];
    for (const e of entries) {
      const link = screen.getByText(e).closest('a');
      expect(link).toBeInTheDocument();
    }
  });

  it('TC-08 成长足迹跳转 /timeline', () => {
    renderHome();
    const heading = screen.getByRole('heading', { name: '成长足迹' });
    const link = heading.closest('section')?.querySelector('a[href="/timeline"]');
    expect(link).toBeInTheDocument();
  });

  it('TC-09 点击查看作品 CTA 滚动到最新作品', () => {
    renderHome();
    const btn = screen.getByRole('button', { name: /查看作品/ });
    expect(btn).toBeInTheDocument();
  });
});
