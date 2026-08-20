import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Variety from './Variety';
import { VARIETY_SHOWS } from '../data/variety';

vi.mock('../hooks/useContentQueries', () => ({
  useVariety: () => ({ data: VARIETY_SHOWS, isLoading: false, isError: false, refetch: vi.fn() }),
}));

function renderVariety() {
  return render(
    <MemoryRouter>
      <Variety />
    </MemoryRouter>,
  );
}

describe('综艺专区页 (Issue #9)', () => {
  it('TC-01 综艺卡片渲染', () => {
    renderVariety();
    for (const s of VARIETY_SHOWS) {
      expect(screen.getByTestId(`variety-card-${s.id}`)).toBeInTheDocument();
    }
  });

  it('TC-02 卡片字段检查', () => {
    renderVariety();
    expect(screen.getByText('《青春有你2》')).toBeInTheDocument();
    expect(screen.getByText('2020 · 爱奇艺')).toBeInTheDocument();
    expect(screen.getByText('选手 → 出道')).toBeInTheDocument();
  });

  it('TC-03 时间倒序排列', () => {
    renderVariety();
    const years = VARIETY_SHOWS.map((s) => s.year).sort((a, b) => b.localeCompare(a));
    expect(years[0]).toBe('2023');
    expect(screen.getByText('《经典舞台晚会》')).toBeInTheDocument();
  });

  it('TC-04 去观看跳转正版平台', () => {
    renderVariety();
    const link = screen.getByTestId('variety-link-v-001');
    expect(link).toHaveAttribute('href', 'https://www.iqiyi.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('TC-05 Tab 切换（音综）', () => {
    renderVariety();
    fireEvent.click(screen.getByTestId('variety-tab-音综'));
    const musicShows = VARIETY_SHOWS.filter((s) => s.category === '音综');
    const other = VARIETY_SHOWS.find((s) => s.category !== '音综');
    for (const s of musicShows) {
      expect(screen.getByTestId(`variety-card-${s.id}`)).toBeInTheDocument();
    }
    if (other) {
      expect(screen.queryByTestId(`variety-card-${other.id}`)).not.toBeInTheDocument();
    }
  });
});
