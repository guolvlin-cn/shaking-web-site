import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Works from './Works';
import { WORKS } from '../data/works';

vi.mock('../hooks/useContentQueries', () => ({
  useWorks: () => ({ data: WORKS, isLoading: false, isError: false, refetch: vi.fn() }),
}));

function renderWorks() {
  return render(
    <MemoryRouter>
      <Works />
    </MemoryRouter>,
  );
}

describe('作品合集页 (Issue #5)', () => {
  it('TC-01 全部作品卡片渲染', () => {
    renderWorks();
    const published = WORKS.filter((w) => w.isPublished);
    expect(published.length).toBeGreaterThan(0);
    for (const w of published) {
      expect(screen.getByTestId(`work-card-${w.id}`)).toBeInTheDocument();
    }
  });

  it('TC-02 Tab 筛选音乐', () => {
    renderWorks();
    fireEvent.click(screen.getByTestId('tab-音乐'));
    const musicWorks = WORKS.filter((w) => w.isPublished && w.type === '音乐');
    const nonMusic = WORKS.find((w) => w.isPublished && w.type !== '音乐');
    for (const w of musicWorks) {
      expect(screen.getByTestId(`work-card-${w.id}`)).toBeInTheDocument();
    }
    if (nonMusic) {
      expect(screen.queryByTestId(`work-card-${nonMusic.id}`)).not.toBeInTheDocument();
    }
  });

  it('TC-03 搜索关键词 THE9', () => {
    renderWorks();
    const input = screen.getByTestId('works-search');
    fireEvent.change(input, { target: { value: 'THE9' } });
    // w-003 青春有你2 与 w-007 THE9 巡回演唱会 含 THE9 标签
    expect(screen.getByTestId('work-card-w-003')).toBeInTheDocument();
    expect(screen.getByTestId('work-card-w-007')).toBeInTheDocument();
  });

  it('TC-04 Ctrl+K 聚焦搜索框', () => {
    renderWorks();
    const input = screen.getByTestId('works-search');
    expect(document.activeElement).not.toBe(input);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(document.activeElement).toBe(input);
  });

  it('TC-05 搜索无结果提示', () => {
    renderWorks();
    const input = screen.getByTestId('works-search');
    fireEvent.change(input, { target: { value: '不存在的作品xyz' } });
    expect(screen.getByTestId('works-empty')).toBeInTheDocument();
    expect(screen.getByText('未找到相关作品')).toBeInTheDocument();
  });

  it('TC-06 点击卡片打开详情模态框', () => {
    renderWorks();
    fireEvent.click(screen.getByTestId('work-card-w-001'));
    const modal = screen.getByTestId('work-modal');
    expect(within(modal).getByRole('heading', { name: '问心2' })).toBeInTheDocument();
    expect(within(modal).getByText('林逸')).toBeInTheDocument();
  });

  it('TC-07 模态框外链去观看', () => {
    renderWorks();
    fireEvent.click(screen.getByTestId('work-card-w-001'));
    const link = screen.getByTestId('work-modal-link');
    expect(link).toHaveAttribute('href', 'https://v.qq.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('TC-08 ESC 关闭模态框', () => {
    renderWorks();
    fireEvent.click(screen.getByTestId('work-card-w-001'));
    expect(screen.getByTestId('work-modal')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByTestId('work-modal')).not.toBeInTheDocument();
  });

  it('TC-09 搜索范围跟随当前 Tab', () => {
    renderWorks();
    fireEvent.click(screen.getByTestId('tab-音乐'));
    const input = screen.getByTestId('works-search');
    fireEvent.change(input, { target: { value: 'THE9' } });
    // 音乐 Tab 下不应出现电视剧 w-001
    expect(screen.queryByTestId('work-card-w-001')).not.toBeInTheDocument();
  });

  it('TC-10 模态框点击遮罩关闭', async () => {
    renderWorks();
    fireEvent.click(screen.getByTestId('work-card-w-001'));
    const modal = screen.getByTestId('work-modal');
    fireEvent.click(modal); // 点击遮罩本身
    await waitFor(() => {
      expect(screen.queryByTestId('work-modal')).not.toBeInTheDocument();
    });
  });
});
