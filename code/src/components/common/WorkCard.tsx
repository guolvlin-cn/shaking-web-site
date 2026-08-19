import { useMemo, useState } from 'react';
import type { Work } from '../../data/works';
import { TYPE_TAG_COLORS } from '../../data/site';

interface WorkCardProps {
  work: Work;
  showStatus?: boolean;
  onView?: (work: Work) => void;
}

export default function WorkCard({ work, showStatus, onView }: WorkCardProps) {
  const [hovered, setHovered] = useState(false);
  const tagClass = useMemo(() => TYPE_TAG_COLORS[work.type] ?? 'bg-border', [work.type]);

  return (
    <article
      className="group relative cursor-pointer overflow-hidden rounded-card border border-border bg-bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onView?.(work)}
      data-testid={`work-card-${work.id}`}
    >
      {/* 封面 */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden"
        style={{ background: work.gradient }}
        role="img"
        aria-label={`${work.title} 封面`}
      >
        <div className="absolute inset-0 flex flex-col justify-end p-3">
          <span
            className={`inline-flex w-fit items-center rounded px-2 py-0.5 text-caption font-medium text-white ${tagClass}`}
          >
            {work.type}
          </span>
        </div>

        {/* 悬停遮罩 */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            type="button"
            className="rounded-full border border-accent-gold px-4 py-2 text-sm text-accent-gold"
            onClick={() => onView?.(work)}
          >
            查看详情
          </button>
        </div>
      </div>

      {/* 信息 */}
      <div className="p-3">
        <h3 className="truncate text-h3 text-text-primary">{work.title}</h3>
        <div className="mt-1 flex items-center justify-between text-caption text-text-secondary">
          <span>
            {work.releaseDate ?? ''} {work.role ? `· ${work.role}` : ''}
          </span>
          {showStatus && work.status !== '已播出' && (
            <span className="text-accent-gold">{work.status}</span>
          )}
        </div>
      </div>
    </article>
  );
}
