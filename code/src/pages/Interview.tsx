import { useMemo, useState } from 'react';
import { ExternalLink, Quote } from 'lucide-react';
import { INTERVIEWS, INTERVIEW_FILTERS, QUOTES, type InterviewItem } from '../data/interview';

const FORMAT_COLORS: Record<string, string> = {
  视频专访: 'bg-[#4834d4]',
  文字专访: 'bg-[#00d2d3]',
  杂志: 'bg-[#ff9f43]',
  电台: 'bg-[#52c41a]',
};

function InterviewCard({ item }: { item: InterviewItem }) {
  const formatClass = FORMAT_COLORS[item.format] ?? 'bg-border';
  return (
    <article
      className="flex gap-4 rounded-card border border-border bg-bg-card p-4 transition-all duration-300 hover:border-accent-gold hover:shadow-hover"
      data-testid={`interview-card-${item.id}`}
    >
      <div
        className="h-40 w-[120px] shrink-0 overflow-hidden rounded-lg"
        style={{ background: item.gradient }}
        role="img"
        aria-label={`${item.title} 封面缩略`}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="text-caption font-medium text-accent-gold">{item.date}</div>
        <h3 className="mt-1 text-h3 text-text-primary">「{item.title}」</h3>
        <p className="mt-1 text-caption text-text-secondary">{item.media}</p>
        <div className="mt-2">
          <span className={`rounded px-2 py-0.5 text-caption text-white ${formatClass}`}>
            {item.format}
          </span>
        </div>
        {item.externalLink && (
          <a
            href={item.externalLink}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm text-accent-gold transition-colors hover:underline"
            data-testid={`interview-link-${item.id}`}
          >
            观看/阅读
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  );
}

export default function Interview() {
  const [filter, setFilter] = useState('全部');

  const filtered = useMemo(() => {
    if (filter === '全部') return INTERVIEWS;
    return INTERVIEWS.filter((i) => i.format === filter);
  }, [filter]);

  return (
    <div className="mx-auto max-w-[900px] px-4 py-12 md:px-8" data-testid="page-interview">
      <div className="section-title-accent">
        <h1 className="section-title text-3xl">采访专区</h1>
      </div>
      <p className="mt-2 text-text-secondary">专访 · 采访实录</p>

      <div className="mt-8 flex gap-6 border-b border-border md:gap-8">
        {INTERVIEW_FILTERS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`relative pb-3 text-sm transition-colors ${
              filter === tab.key
                ? 'font-semibold text-accent-gold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            aria-pressed={filter === tab.key}
            data-testid={`interview-tab-${tab.key}`}
          >
            {tab.label}
            {filter === tab.key && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent-gold" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {filtered.map((item) => (
          <InterviewCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-text-secondary">该分类下暂无采访内容</div>
      )}

      {/* 精彩语录 */}
      {filter === '全部' && (
        <div className="mt-12 space-y-4">
          {QUOTES.map((q) => (
            <blockquote
              key={q.source}
              className="rounded-card border border-accent-gold/20 bg-accent-gold/5 p-8 text-center"
            >
              <Quote size={40} className="mx-auto text-accent-gold" aria-hidden="true" />
              <p className="mt-2 text-h3 font-medium text-text-primary">"{q.text}"</p>
              <footer className="mt-3 text-caption text-text-secondary">— {q.source}</footer>
            </blockquote>
          ))}
        </div>
      )}
    </div>
  );
}
