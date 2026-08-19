import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface LightboxProps {
  photos: string[];
  title?: string;
  open: boolean;
  onClose: () => void;
}

const PHOTO_GRADIENTS: Record<string, string> = {
  'st-001-1': 'linear-gradient(135deg, #1b002d 0%, #3d1b00 100%)',
  'st-001-2': 'linear-gradient(135deg, #2d0014 0%, #1b002d 100%)',
  'st-001-3': 'linear-gradient(135deg, #1b002d 0%, #002b1b 100%)',
  'st-002-1': 'linear-gradient(135deg, #4d1b00 0%, #2d0014 100%)',
  'st-002-2': 'linear-gradient(135deg, #3d2d00 0%, #4d1b00 100%)',
  'st-003-1': 'linear-gradient(135deg, #002b1b 0%, #1b004d 100%)',
  'st-003-2': 'linear-gradient(135deg, #004d3d 0%, #002b1b 100%)',
  'st-003-3': 'linear-gradient(135deg, #002b1b 0%, #2d0014 100%)',
  'st-003-4': 'linear-gradient(135deg, #003d2d 0%, #1b002d 100%)',
  'st-004-1': 'linear-gradient(135deg, #2d0014 0%, #4d1b00 100%)',
  'st-004-2': 'linear-gradient(135deg, #001f3f 0%, #2d0014 100%)',
  'st-005-1': 'linear-gradient(135deg, #1b004d 0%, #2d0014 100%)',
  'st-005-2': 'linear-gradient(135deg, #2b1b00 0%, #1b004d 100%)',
  'st-005-3': 'linear-gradient(135deg, #1b004d 0%, #004d3d 100%)',
};

const DEFAULT_GRADIENT = 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)';

export default function Lightbox({ photos, title, open, onClose }: LightboxProps) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
    setZoom(1);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, prev, next]);

  if (!open || photos.length === 0) return null;

  const photo = photos[index];

  return (
    <div
      className="fixed inset-0 z-[800] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? '图片浏览'}
      data-testid="lightbox"
    >
      {/* 关闭 */}
      <button
        type="button"
        onClick={onClose}
        aria-label="关闭"
        className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {/* 左右切换 */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="上一张"
            className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="下一张"
            className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* 图片 */}
      <div
        className="relative max-h-[80vh] max-w-[80vw] overflow-hidden rounded-lg"
        style={{
          background: PHOTO_GRADIENTS[photo] ?? DEFAULT_GRADIENT,
          transform: `scale(${zoom})`,
          transition: 'transform 0.2s ease',
        }}
        role="img"
        aria-label={`图片 ${index + 1} / ${photos.length}`}
        onClick={(e) => e.stopPropagation()}
        data-testid="lightbox-image"
      >
        <div className="aspect-[3/4] w-[70vw] max-w-[420px] md:w-[420px]" />
      </div>

      {/* 底部控制 */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3">
        <button
          type="button"
          aria-label="缩小"
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.max(0.5, z - 0.25));
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ZoomOut size={18} />
        </button>
        <span className="text-sm text-white/80">
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          aria-label="放大"
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.min(2, z + 0.25));
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <ZoomIn size={18} />
        </button>
        <button
          type="button"
          aria-label="下载"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
}
