import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutGrid, Rows } from 'lucide-react';
import { PHOTOS, ALBUM_FILTERS, type AlbumFilter } from '../data/photos';

const PAGE_SIZE = 8;

export default function Gallery() {
  const [album, setAlbum] = useState<AlbumFilter>('全部');
  const [mode, setMode] = useState<'masonry' | 'grid'>('masonry');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (album === '全部' ? PHOTOS : PHOTOS.filter((p) => p.album === album)),
    [album],
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // 无限滚动（IntersectionObserver）
  useEffect(() => {
    if (!hasMore) return;
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => c + PAGE_SIZE);
        }
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, album]);

  // 切换分类时重置
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setLightboxIndex(null);
  }, [album]);

  const openPhoto = (index: number) => setLightboxIndex(index);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + visible.length) % visible.length)),
    [visible.length],
  );
  const nextPhoto = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % visible.length)),
    [visible.length],
  );

  // 灯箱键盘导航
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, prevPhoto, nextPhoto, closeLightbox]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-8" data-testid="page-gallery">
      <div className="section-title-accent">
        <h1 className="section-title text-3xl">相册图库</h1>
      </div>
      <p className="mt-2 text-text-secondary">舞台照 · 写真 · 路透 · 饭拍</p>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {ALBUM_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setAlbum(f)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                album === f
                  ? 'border-accent-gold bg-accent-gold font-semibold text-bg-base'
                  : 'border-border text-text-secondary hover:bg-white/5 hover:text-text-primary'
              }`}
              aria-pressed={album === f}
              data-testid={`gallery-album-${f}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('masonry')}
            aria-label="瀑布流模式"
            aria-pressed={mode === 'masonry'}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
              mode === 'masonry'
                ? 'border-accent-gold text-accent-gold'
                : 'border-border text-text-secondary'
            }`}
          >
            <Rows size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMode('grid')}
            aria-label="网格模式"
            aria-pressed={mode === 'grid'}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
              mode === 'grid'
                ? 'border-accent-gold text-accent-gold'
                : 'border-border text-text-secondary'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* 图片列表 */}
      <div
        className={
          mode === 'grid'
            ? 'mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4'
            : 'mt-8 columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4 [&>*]:mb-3 md:[&>*]:mb-4'
        }
      >
        {visible.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => openPhoto(i)}
            className="group relative block w-full overflow-hidden rounded-card border border-border bg-bg-card text-left transition-all duration-300 hover:border-accent-gold"
            data-testid={`gallery-photo-${photo.id}`}
          >
            <div
              className="w-full aspect-[3/4]"
              style={{ background: photo.gradient }}
              role="img"
              aria-label={photo.title}
            >
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <div>
                  <div className="text-sm font-medium text-white">{photo.title}</div>
                  <div className="text-caption text-white/70">{photo.album}</div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 加载指示器 */}
      {hasMore ? (
        <div ref={loaderRef} className="py-8 text-center text-text-secondary" data-testid="gallery-loader">
          加载中…
        </div>
      ) : (
        <div className="py-8 text-center text-caption text-text-secondary" data-testid="gallery-end">
          已加载全部图片（{filtered.length} 张）
        </div>
      )}

      {/* 灯箱 */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[800] flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={visible[lightboxIndex]?.title}
          data-testid="gallery-lightbox"
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="关闭"
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            aria-label="上一张"
            className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            aria-label="下一张"
            className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            ›
          </button>
          {visible[lightboxIndex] && (
            <div
              className="relative max-h-[80vh] w-[420px] max-w-[85vw] overflow-hidden rounded-lg"
              style={{ background: visible[lightboxIndex].gradient }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[3/4] w-full" role="img" aria-label={visible[lightboxIndex].title} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="text-sm font-medium text-white">{visible[lightboxIndex].title}</div>
                <div className="mt-0.5 text-caption text-white/70">
                  {lightboxIndex + 1} / {visible.length}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
