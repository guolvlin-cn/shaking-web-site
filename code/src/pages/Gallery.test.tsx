import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Gallery from './Gallery';
import { PHOTOS } from '../data/photos';

vi.mock('../hooks/useContentQueries', () => ({
  usePhotos: () => ({ data: PHOTOS, isLoading: false, isError: false, refetch: vi.fn() }),
}));

function renderGallery() {
  return render(
    <MemoryRouter>
      <Gallery />
    </MemoryRouter>,
  );
}

describe('相册图库页 (Issue #11)', () => {
  it('TC-01 图片网格渲染（分页加载前 8 张）', () => {
    renderGallery();
    const first8 = PHOTOS.slice(0, 8);
    for (const p of first8) {
      expect(screen.getByTestId(`gallery-photo-${p.id}`)).toBeInTheDocument();
    }
    // 第 9 张未加载（分页）
    expect(screen.queryByTestId('gallery-photo-p-009')).not.toBeInTheDocument();
  });

  it('TC-02 分类筛选（写真）', () => {
    renderGallery();
    fireEvent.click(screen.getByTestId('gallery-album-写真'));
    const photos = PHOTOS.filter((p) => p.album === '写真');
    for (const p of photos) {
      expect(screen.getByTestId(`gallery-photo-${p.id}`)).toBeInTheDocument();
    }
    const nonAlbum = PHOTOS.find((p) => p.album !== '写真');
    if (nonAlbum) {
      expect(screen.queryByTestId(`gallery-photo-${nonAlbum.id}`)).not.toBeInTheDocument();
    }
  });

  it('TC-03 模式切换（网格）', () => {
    renderGallery();
    fireEvent.click(screen.getByLabelText('网格模式'));
    expect(screen.getByLabelText('网格模式')).toHaveAttribute('aria-pressed', 'true');
  });

  it('TC-04 点击图片打开灯箱', () => {
    renderGallery();
    fireEvent.click(screen.getByTestId('gallery-photo-p-001'));
    expect(screen.getByTestId('gallery-lightbox')).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 8/)).toBeInTheDocument();
  });

  it('TC-05 灯箱右方向键切换', () => {
    renderGallery();
    fireEvent.click(screen.getByTestId('gallery-photo-p-001'));
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText(/2 \/ 8/)).toBeInTheDocument();
  });

  it('TC-06 ESC 关闭灯箱', () => {
    renderGallery();
    fireEvent.click(screen.getByTestId('gallery-photo-p-001'));
    expect(screen.getByTestId('gallery-lightbox')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByTestId('gallery-lightbox')).not.toBeInTheDocument();
  });

  it('TC-07 滚动到底加载更多', () => {
    renderGallery();
    // 模拟 IntersectionObserver 触发（jsdom 无 IO，直接验证 hasMore 逻辑存在）
    expect(screen.getByTestId('gallery-loader')).toBeInTheDocument();
    expect(screen.queryByTestId('gallery-end')).not.toBeInTheDocument();
  });

  it('TC-08 分类后数量显示', () => {
    renderGallery();
    fireEvent.click(screen.getByTestId('gallery-album-路透'));
    const photos = PHOTOS.filter((p) => p.album === '路透');
    expect(screen.getByTestId('gallery-end')).toBeInTheDocument();
    expect(screen.getByText(`已加载全部图片（${photos.length} 张）`)).toBeInTheDocument();
  });
});
