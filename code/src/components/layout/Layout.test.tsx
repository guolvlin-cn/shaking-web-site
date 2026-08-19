import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './AppLayout';
import { useUIStore } from '../../stores/uiStore';
import PlaceholderPage from '../common/PlaceholderPage';

// jsdom 不实现 matchMedia，提供最小 stub
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  useUIStore.setState({ sidebarCollapsed: false, mobileMenuOpen: false });
  // 恢复 scrollY 为 0
  Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderLayout(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<PlaceholderPage title="首页" />} />
          <Route path="/works" element={<PlaceholderPage title="作品合集" />} />
          <Route path="/music" element={<PlaceholderPage title="音乐专区" />} />
          <Route path="/gallery" element={<PlaceholderPage title="相册图库" />} />
          <Route path="/about" element={<PlaceholderPage title="关于谢可寅" />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('全局布局与导航 (Issue #2)', () => {
  it('TC-01 渲染顶部栏 Logo 与页面标题', async () => {
    renderLayout('/');
    expect(await screen.findByText('Shaking Chloe')).toBeInTheDocument();
    const pageTitle = screen.getByTestId('page-title');
    expect(pageTitle).toHaveTextContent('首页');
    // 面包屑标题
    expect(document.querySelector('header')?.textContent).toContain('首页');
  });

  it('TC-02 渲染侧边导航全部入口', async () => {
    renderLayout('/');
    await screen.findByText('Shaking Chloe');
    const nav = screen.getByLabelText('侧边导航');
    // 作品组
    expect(within(nav).getByText('作品合集')).toBeInTheDocument();
    expect(within(nav).getByText('音乐专区')).toBeInTheDocument();
    expect(within(nav).getByText('影视专区')).toBeInTheDocument();
    expect(within(nav).getByText('舞台活动')).toBeInTheDocument();
    expect(within(nav).getByText('综艺专区')).toBeInTheDocument();
    expect(within(nav).getByText('采访专区')).toBeInTheDocument();
    // 其他组
    expect(within(nav).getByText('相册图库')).toBeInTheDocument();
    expect(within(nav).getByText('关于谢可寅')).toBeInTheDocument();
    expect(within(nav).getByText('问答机器人')).toBeInTheDocument();
  });

  it('TC-03 点击作品导航跳转并高亮', async () => {
    renderLayout('/');
    await screen.findByText('Shaking Chloe');
    const nav = screen.getByLabelText('侧边导航');
    fireEvent.click(within(nav).getByText('作品合集'));
    expect(await screen.findByTestId('page-title')).toHaveTextContent('作品合集');
    // NavLink active 类生效
    await waitFor(() => {
      const link = within(nav).getByText('作品合集').closest('a');
      expect(link).toHaveClass('text-accent-gold');
    });
  });

  it('TC-04 滚动后顶部栏背景变化', async () => {
    renderLayout('/');
    await screen.findByText('Shaking Chloe');
    const header = document.querySelector('header');
    expect(header).not.toHaveClass('border-border');

    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 300 });
    fireEvent.scroll(window);
    await waitFor(() => {
      expect(header).toHaveClass('border-border');
    });
  });

  it('TC-05 收起/展开侧边栏按钮切换 store 状态', async () => {
    renderLayout('/');
    await screen.findByText('Shaking Chloe');
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
    fireEvent.click(screen.getByLabelText('收起侧边栏'));
    expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    fireEvent.click(screen.getByLabelText('展开侧边栏'));
    expect(useUIStore.getState().sidebarCollapsed).toBe(false);
  });

  it('TC-06 汉堡菜单开合（移动端）', async () => {
    renderLayout('/');
    await screen.findByText('Shaking Chloe');
    expect(useUIStore.getState().mobileMenuOpen).toBe(false);
    fireEvent.click(screen.getByLabelText('打开菜单'));
    expect(useUIStore.getState().mobileMenuOpen).toBe(true);
    fireEvent.click(screen.getByLabelText('关闭菜单'));
    expect(useUIStore.getState().mobileMenuOpen).toBe(false);
  });

  it('TC-07 移动端底部导航可见', async () => {
    renderLayout('/');
    await screen.findByText('Shaking Chloe');
    const bottomNav = screen.getByLabelText('底部导航');
    expect(bottomNav).toBeInTheDocument();
    expect(within(bottomNav).getByText('作品')).toBeInTheDocument();
    expect(within(bottomNav).getByText('相册')).toBeInTheDocument();
  });

  it('TC-08 社交链接新标签页打开', async () => {
    renderLayout('/');
    await screen.findByText('Shaking Chloe');
    const weibo = screen.getByLabelText('微博');
    expect(weibo).toHaveAttribute('href', expect.stringContaining('weibo.com'));
    expect(weibo).toHaveAttribute('target', '_blank');
    expect(weibo).toHaveAttribute('rel', 'noreferrer');
    expect(screen.getByLabelText('Instagram')).toHaveAttribute('href', expect.stringContaining('instagram.com'));
  });
});
