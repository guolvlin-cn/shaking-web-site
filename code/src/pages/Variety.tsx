import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { VARIETY_SHOWS, VARIETY_FILTERS, type VarietyShow } from '../data/variety';

const CATEGORY_COLORS: Record<string, string> = {
  选秀: 'bg-[#ff9f43]',
  真人秀: 'bg-[#00d2d3]',
  音综: 'bg-[#4834d4]',
  晚会: 'bg-[#f5c518]',
};

function VarietyCard({ show }: { show: VarietyShow }) {
  const tagClass = CATEGORY_COLORS[show.category] ?? 'bg-border';
  return (
    <article
      className="group overflow-hidden rounded-card border border-border bg-bg-card transition-all duration-300 hover:border-accent-gold hover:shadow-hover"
      data-testid={`variety-card-${show.id}`}
    >
      <div
        className="relative h-60 w-full"
        style={{ background: show.gradient }}
        role="img"
        aria-label={`${show.name} 海报`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-h3 font-bold text-white/80">{show.name}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-h3 text-text-primary">《{show.name}》</h3>
        <p className="mt-1 text-caption text-text-secondary">
          {show.year} · {show.platform}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className={`rounded px-2 py-0.5 text-caption text-white ${tagClass}`}>
            {show.role}
          </span>
        </div>
        {show.externalLink && (
          <a
            href={show.externalLink}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm text-accent-gold transition-colors hover:underline"
            data-testid={`variety-link-${show.id}`}
          >
            去观看
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}

export default function Variety() {
  const [filter, setFilter] = useState('全部');

  const filtered = useMemo(() => {
    if (filter === '全部') return VARIETY_SHOWS;
    return VARIETY_SHOWS.filter((s) => s.category === filter);
  }, [filter]);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-8" data-testid="page-variety">
      <div className="section-title-accent">
        <h1 className="section-title text-3xl">综艺专区</h1>
      </div>
      <p className="mt-2 text-text-secondary">选秀 · 真人秀 · 音综 · 晚会</p>

      <div className="mt-8 flex gap-6 border-b border-border md:gap-8">
        {VARIETY_FILTERS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`relative pb-3 text-sm transition-colors ${
              filter === tab.key
                ? 'font-semibold text-accent-gold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            data-testid={`variety-tab-${tab.key}`}
          >
            {tab.label}
            {filter === tab.key && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent-gold" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((show) => (
          <VarietyCard key={show.id} show={show} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-text-secondary">该分类下暂无综艺节目</div>
      )}
    </div>
  );
}
