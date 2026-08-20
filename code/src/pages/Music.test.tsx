import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MusicPage from './Music';
import { MUSIC_WORKS } from '../data/music';

vi.mock('../hooks/useContentQueries', () => ({
  useMusic: () => ({ data: MUSIC_WORKS, isLoading: false, isError: false, refetch: vi.fn() }),
}));

function renderMusic() {
  return render(
    <MemoryRouter>
      <MusicPage />
    </MemoryRouter>,
  );
}

describe('音乐专区页 (Issue #6)', () => {
  it('TC-01 全部音乐卡片渲染', () => {
    renderMusic();
    for (const w of MUSIC_WORKS) {
      expect(screen.getByTestId(`music-card-${w.id}`)).toBeInTheDocument();
    }
  });

  it('TC-02 分类 Tab 切换（原创单曲）', () => {
    renderMusic();
    fireEvent.click(screen.getByTestId('music-tab-原创单曲'));
    const originals = MUSIC_WORKS.filter((w) => w.category === '原创单曲');
    const nonOriginal = MUSIC_WORKS.find((w) => w.category !== '原创单曲');
    for (const w of originals) {
      expect(screen.getByTestId(`music-card-${w.id}`)).toBeInTheDocument();
    }
    if (nonOriginal) {
      expect(screen.queryByTestId(`music-card-${nonOriginal.id}`)).not.toBeInTheDocument();
    }
  });

  it('TC-03 播放按钮跳转外部平台', () => {
    renderMusic();
    const link = screen.getByLabelText('播放 Black Cupid');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('href', expect.stringContaining('music.163.com'));
  });

  it('TC-04 THE9 时期区块存在', () => {
    renderMusic();
    expect(screen.getByText('THE9 时期作品')).toBeInTheDocument();
    expect(screen.getByTestId('music-card-m-004')).toBeInTheDocument();
  });

  it('TC-05 卡片含词曲信息', () => {
    renderMusic();
    expect(screen.getByText('Black Cupid')).toBeInTheDocument();
    expect(screen.getAllByText('谢可寅').length).toBeGreaterThan(0);
    expect(screen.getByText('2022-02-14')).toBeInTheDocument();
  });
});
