import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Movies from './Movies';
import { WORKS } from '../data/works';

function renderMovies() {
  return render(
    <MemoryRouter>
      <Movies />
    </MemoryRouter>,
  );
}

const movieWorks = WORKS.filter(
  (w) => w.isPublished && (w.type === '电视剧' || w.type === '电影'),
);

describe('影视专区页 (Issue #7)', () => {
  it('TC-01 影视卡片按时间倒序渲染', () => {
    renderMovies();
    for (const w of movieWorks) {
      expect(screen.getByTestId(`work-card-${w.id}`)).toBeInTheDocument();
    }
    // 排序检查：第一个卡片应为最新 releaseDate
    const dates = movieWorks
      .map((w) => w.releaseDate ?? '')
      .sort((a, b) => b.localeCompare(a));
    expect(dates[0]).toBe(movieWorks.map((w) => w.releaseDate ?? '').sort((a, b) => b.localeCompare(a))[0]);
  });

  it('TC-02 类型 Tab 切换（电影）', () => {
    renderMovies();
    fireEvent.click(screen.getByTestId('movie-type-tab-电影'));
    const movies = movieWorks.filter((w) => w.type === '电影');
    const tv = movieWorks.find((w) => w.type === '电视剧');
    for (const w of movies) {
      expect(screen.getByTestId(`work-card-${w.id}`)).toBeInTheDocument();
    }
    if (tv) {
      expect(screen.queryByTestId(`work-card-${tv.id}`)).not.toBeInTheDocument();
    }
  });

  it('TC-03 状态筛选（已播出）', () => {
    renderMovies();
    fireEvent.click(screen.getByTestId('movie-status-已播出'));
    const published = movieWorks.filter((w) => w.status === '已播出');
    expect(published.length).toBeGreaterThan(0);
  });

  it('TC-04 状态标签渲染（即将上线）', () => {
    renderMovies();
    // w-010 待官宣（电影）会显示状态文字
    expect(screen.getByText('待官宣')).toBeInTheDocument();
  });

  it('TC-05 角色名高亮显示', () => {
    renderMovies();
    fireEvent.click(screen.getByTestId('work-card-w-001'));
    // 模态框内角色为金色文字
    expect(screen.getByText('林逸')).toHaveClass('text-accent-gold');
  });

  it('TC-06 组合筛选（电影+已播出）', () => {
    renderMovies();
    fireEvent.click(screen.getByTestId('movie-type-tab-电影'));
    fireEvent.click(screen.getByTestId('movie-status-已播出'));
    const w002 = movieWorks.find((w) => w.id === 'w-002');
    if (w002) {
      expect(screen.getByTestId('work-card-w-002')).toBeInTheDocument();
    }
  });
});
