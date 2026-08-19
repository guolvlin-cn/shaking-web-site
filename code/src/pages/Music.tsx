import { useMemo, useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { MUSIC_WORKS, MUSIC_FILTERS, type MusicWork } from '../data/music';

const MUSIC_TAG_COLORS: Record<string, string> = {
  原创: 'bg-[#ff6b6b]',
  说唱: 'bg-[#ff9f43]',
  合作: 'bg-[#00d2d3]',
  团体: 'bg-[#4834d4]',
  翻唱: 'bg-[#52c41a]',
  Live: 'bg-[#f5c518]',
  舞台: 'bg-[#00d2d3]',
  筹备: 'bg-[#a0a0a0]',
  THE9: 'bg-[#4834d4]',
  EP: 'bg-[#ff6b6b]',
};

function MusicCard({ work }: { work: MusicWork }) {
  return (
    <article
      className="group flex h-40 items-center gap-4 rounded-card border border-border bg-bg-card p-4 transition-all duration-300 hover:border-accent-gold hover:bg-accent-gold/[0.03]"
      data-testid={`music-card-${work.id}`}
    >
      {/* 封面 */}
      <div
        className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-lg"
        style={{ background: work.gradient }}
        role="img"
        aria-label={`${work.title} 封面`}
      >
        {work.externalLink && (
          <a
            href={work.externalLink}
            target="_blank"
            rel="noreferrer"
            aria-label={`播放 ${work.title}`}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold transition-all group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(245,197,24,0.4)]">
              <Play size={16} className="fill-bg-base text-bg-base" />
            </span>
          </a>
        )}
      </div>

      {/* 信息 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate text-h3 text-text-primary">{work.title}</h3>
        <p className="mt-0.5 text-caption text-text-secondary">{work.artist}</p>
        {work.album && <p className="mt-0.5 text-caption text-text-secondary">专辑《{work.album}》</p>}
        {work.releaseDate && (
          <p className="mt-0.5 text-caption text-text-secondary">{work.releaseDate}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {work.tags.map((t) => (
            <span
              key={t}
              className={`rounded px-1.5 py-0.5 text-caption text-white ${
                MUSIC_TAG_COLORS[t] ?? 'bg-border'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function MusicPage() {
  const [filter, setFilter] = useState('全部');

  const filtered = useMemo(() => {
    if (filter === '全部') {
      // THE9 时期作品在下方特殊区块展示，主网格排除
      return MUSIC_WORKS.filter((w) => w.category !== 'THE9时期');
    }
    return MUSIC_WORKS.filter((w) => w.category === filter);
  }, [filter]);

  const the9Works = useMemo(() => MUSIC_WORKS.filter((w) => w.category === 'THE9时期'), []);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-8" data-testid="page-music">
      <div className="section-title-accent">
        <h1 className="section-title text-3xl">音乐专区</h1>
      </div>
      <p className="mt-2 text-text-secondary">原创单曲 · EP · 合作曲</p>

      {/* 分类 Tab */}
      <div className="mt-8 flex gap-6 border-b border-border md:gap-8">
        {MUSIC_FILTERS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`relative pb-3 text-sm transition-colors ${
              filter === tab.key
                ? 'font-semibold text-accent-gold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            data-testid={`music-tab-${tab.key}`}
          >
            {tab.label}
            {filter === tab.key && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent-gold" />
            )}
          </button>
        ))}
      </div>

      {/* 网格 */}
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((work) => (
          <MusicCard key={work.id} work={work} />
        ))}
      </div>

      {/* THE9 时期特殊区块 */}
      {filter === '全部' && the9Works.length > 0 && (
        <div className="mt-12 rounded-card border border-accent-gold/40 bg-bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="section-title">THE9 时期作品</h2>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="向左滚动"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent-gold hover:text-accent-gold"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="向右滚动"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent-gold hover:text-accent-gold"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {the9Works.map((work) => (
              <MusicCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-16 text-center text-text-secondary">该分类下暂无音乐作品</div>
      )}
    </div>
  );
}
