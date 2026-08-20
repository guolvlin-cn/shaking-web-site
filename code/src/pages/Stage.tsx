import { useMemo, useState } from 'react';
import { Camera } from 'lucide-react';
import type { StageEvent } from '@shared/types';
import { useStage } from '../hooks/useContentQueries';
import { ErrorState, LoadingState } from '../components/common/AsyncState';
import Lightbox from '../components/common/Lightbox';

const STAGE_FILTERS: Array<{ key: string; label: string }> = [
  { key: '全部', label: '全部' },
  { key: '晚会', label: '晚会' },
  { key: '音乐节', label: '音乐节' },
  { key: '团体活动', label: '团体活动' },
  { key: '选秀历程', label: '选秀历程' },
  { key: '颁奖典礼', label: '颁奖典礼' },
];

function StageCard({ event, onOpenGallery }: { event: StageEvent; onOpenGallery: (e: StageEvent) => void }) {
  return (
    <article
      className="overflow-hidden rounded-card border border-border bg-bg-card transition-all duration-300 hover:border-accent-gold hover:shadow-hover"
      data-testid={`stage-card-${event.id}`}
    >
      <div
        className="relative h-60 w-full"
        style={{ background: event.gradient }}
        role="img"
        aria-label={`${event.name} 舞台照片`}
      >
        <div className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
          <span className="text-h3 font-bold text-white">{event.name}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="text-caption font-medium text-accent-gold">{event.date}</div>
        <h3 className="mt-1 text-h3 text-text-primary">{event.name}</h3>
        <p className="mt-1 text-sm text-text-secondary">{event.location}</p>
        <p className="mt-1 text-sm text-text-secondary">{event.performance}</p>
        <button
          type="button"
          onClick={() => onOpenGallery(event)}
          className="mt-3 flex items-center gap-1.5 text-sm text-accent-gold transition-colors hover:underline"
        >
          <Camera size={16} />
          查看图集（{event.photos?.length ?? 0} 张）
        </button>
      </div>
    </article>
  );
}

export default function Stage() {
  const [filter, setFilter] = useState('全部');
  const [galleryEvent, setGalleryEvent] = useState<StageEvent | null>(null);
  const { data: stageEvents = [], isLoading, isError, refetch } = useStage();

  const filtered = useMemo(() => {
    const list =
      filter === '全部' ? stageEvents : stageEvents.filter((e) => e.category === filter);
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [stageEvents, filter]);

  const galleryPhotos = useMemo(
    () => galleryEvent?.photos ?? [],
    [galleryEvent],
  );

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-8" data-testid="page-stage">
      <div className="section-title-accent">
        <h1 className="section-title text-3xl">舞台活动</h1>
      </div>
      <p className="mt-2 text-text-secondary">晚会 · 音乐节 · 颁奖典礼</p>

      {/* 分类筛选 */}
      <div className="mt-8 flex flex-wrap gap-3">
        {STAGE_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filter === f.key
                ? 'border-accent-gold bg-accent-gold font-semibold text-bg-base'
                : 'border-border text-text-secondary hover:bg-white/5 hover:text-text-primary'
            }`}
            aria-pressed={filter === f.key}
            data-testid={`stage-tab-${f.key}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 卡片网格 */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event) => (
              <StageCard key={event.id} event={event} onOpenGallery={setGalleryEvent} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-text-secondary">该分类下暂无舞台活动</div>
          )}
        </>
      )}

      <Lightbox
        photos={galleryPhotos}
        title={galleryEvent?.name}
        open={galleryEvent !== null}
        onClose={() => setGalleryEvent(null)}
      />
    </div>
  );
}
