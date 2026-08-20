import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import type { TimelineEvent } from '@shared/types';
import { useTimeline } from '../hooks/useContentQueries';
import { ErrorState, LoadingState } from '../components/common/AsyncState';

const TIMELINE_FILTERS: Array<{ key: string; label: string }> = [
  { key: '全部', label: '全部' },
  { key: '选秀', label: '选秀' },
  { key: '出道', label: '出道' },
  { key: '影视', label: '影视' },
  { key: '音乐', label: '音乐' },
  { key: '舞台', label: '舞台' },
  { key: '获奖', label: '获奖' },
];

const CATEGORY_COLORS: Record<string, string> = {
  选秀: 'bg-[#ff9f43]',
  出道: 'bg-[#f5c518]',
  影视: 'bg-[#4834d4]',
  音乐: 'bg-[#ff6b6b]',
  舞台: 'bg-[#00d2d3]',
  获奖: 'bg-[#52c41a]',
  其他: 'bg-[#a0a0a0]',
};

const getYearGroups = (events: TimelineEvent[]): Map<string, TimelineEvent[]> => {
  const groups = new Map<string, TimelineEvent[]>();
  const sorted = [...events].sort((a, b) => b.eventDate.localeCompare(a.eventDate));
  for (const ev of sorted) {
    const year = ev.eventDate.slice(0, 4);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year)!.push(ev);
  }
  return groups;
};

function TimelineNode({ event, side }: { event: TimelineEvent; side: 'left' | 'right' }) {
  const [expanded, setExpanded] = useState(false);
  const categoryClass = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS['其他'];

  return (
    <div
      className={`relative flex w-[calc(50%-24px)] flex-col ${
        side === 'left' ? 'items-end text-right' : 'items-start text-left'
      }`}
      data-testid={`timeline-node-${event.id}`}
    >
      <article
        className={`group w-full cursor-pointer rounded-card border border-border bg-bg-card p-4 transition-all duration-300 hover:border-accent-gold hover:shadow-hover ${
          expanded ? 'border-accent-gold shadow-gold' : ''
        }`}
        onClick={() => setExpanded((v) => !v)}
        data-testid={`timeline-card-${event.id}`}
      >
        {/* 缩略图 */}
        <div
          className="relative h-40 w-full overflow-hidden rounded-lg"
          style={{ background: event.gradient }}
          role="img"
          aria-label={`${event.title} 缩略图`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-h3 font-bold text-white/70">{event.title}</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-caption font-medium text-accent-gold">{event.eventDate}</div>
          <h3 className="mt-1 text-h3 text-text-primary">{event.title}</h3>
          <p className={`mt-1 text-body text-text-secondary ${expanded ? '' : 'line-clamp-2'}`}>
            {event.description}
          </p>

          {expanded && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded px-2 py-0.5 text-caption text-white ${categoryClass}`}>
                {event.category}
              </span>
              {event.relatedWorks?.map((wId) => (
                <Link
                  key={wId}
                  to="/works"
                  className="rounded border border-border px-2 py-0.5 text-caption text-accent-gold transition-colors hover:border-accent-gold"
                  onClick={(e) => e.stopPropagation()}
                >
                  相关作品 →
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-center gap-1 text-caption text-text-secondary">
          <ChevronDown
            size={14}
            className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          />
          {expanded ? '收起' : '展开'}
        </div>
      </article>
    </div>
  );
}

export default function TimelinePage() {
  const [filter, setFilter] = useState<'全部' | string>('全部');
  const { data: events = [], isLoading, isError, refetch } = useTimeline();

  const filteredEvents = useMemo(() => {
    if (filter === '全部') return events;
    return events.filter((e) => e.category === filter);
  }, [events, filter]);

  const yearGroups = useMemo(() => getYearGroups(filteredEvents), [filteredEvents]);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-8" data-testid="page-timeline">
      <div className="section-title-accent">
        <h1 className="section-title text-3xl">成长时间线</h1>
      </div>
      <p className="mt-2 text-text-secondary">从选秀舞台到全能艺人</p>

      {/* 筛选标签 */}
      <div className="mt-6 flex flex-wrap gap-3">
        {TIMELINE_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filter === f.key
                ? 'border-accent-gold bg-accent-gold font-semibold text-bg-base'
                : 'border-border text-text-secondary hover:border-[#3a3a3a] hover:bg-white/5 hover:text-text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 时间线主体 */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="relative mt-10">
          {/* 中轴线 */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#3a3a3a]" />

          {Array.from(yearGroups.entries()).map(([year, yearEvents]) => (
            <div key={year} className="mb-12" data-testid={`timeline-year-${year}`}>
              {/* 年份标记 */}
              <div className="relative z-10 mb-8 flex justify-center">
                <span className="rounded-full border border-border bg-bg-card px-6 py-2 text-h3 font-bold text-accent-gold">
                  {year}
                </span>
              </div>

              <div className="relative flex flex-col gap-8">
                {yearEvents.map((ev, i) => (
                  <div key={ev.id} className="relative flex justify-center">
                    {/* 节点圆点 */}
                    <span className="absolute left-1/2 top-6 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-accent-gold bg-bg-base" />
                    <TimelineNode event={ev} side={i % 2 === 0 ? 'left' : 'right'} />
                    <div className="w-[calc(50%-24px)]" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {yearGroups.size === 0 && (
            <div className="py-16 text-center text-text-secondary">该分类下暂无时间线事件</div>
          )}
        </div>
      )}
    </div>
  );
}
