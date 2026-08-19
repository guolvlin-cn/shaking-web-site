import { useMemo, useState } from 'react';
import { WORKS, type Work } from '../data/works';
import WorkCard from '../components/common/WorkCard';
import WorkModal from '../components/common/WorkModal';

const TYPE_TABS = [
  { key: '全部', label: '全部' },
  { key: '电视剧', label: '电视剧' },
  { key: '电影', label: '电影' },
  { key: '微综', label: '微综' },
];

const STATUS_TABS = ['全部', '已播出', '即将上线', '热播中'];

export default function Movies() {
  const [typeTab, setTypeTab] = useState('全部');
  const [statusTab, setStatusTab] = useState('全部');
  const [selected, setSelected] = useState<Work | null>(null);

  const filtered = useMemo(() => {
    let list = WORKS.filter((w) => w.isPublished && (w.type === '电视剧' || w.type === '电影'));
    if (typeTab !== '全部') {
      list = list.filter((w) => w.type === typeTab);
    }
    if (statusTab !== '全部') {
      list = list.filter((w) => w.status === statusTab);
    }
    return list.sort((a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''));
  }, [typeTab, statusTab]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-8" data-testid="page-movies">
      <div className="section-title-accent">
        <h1 className="section-title text-3xl">影视专区</h1>
      </div>
      <p className="mt-2 text-text-secondary">电视剧 · 电影 · 微综</p>

      {/* 类型 Tab */}
      <div className="mt-8 flex gap-6 border-b border-border md:gap-8">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setTypeTab(tab.key)}
            className={`relative pb-3 text-sm transition-colors ${
              typeTab === tab.key
                ? 'font-semibold text-accent-gold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            aria-pressed={typeTab === tab.key}
            data-testid={`movie-type-tab-${tab.key}`}
          >
            {tab.label}
            {typeTab === tab.key && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent-gold" />
            )}
          </button>
        ))}
      </div>

      {/* 状态筛选 */}
      <div className="mt-4 flex flex-wrap gap-3">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusTab(s)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              statusTab === s
                ? 'border-accent-gold bg-accent-gold font-semibold text-bg-base'
                : 'border-border text-text-secondary hover:bg-white/5 hover:text-text-primary'
            }`}
            aria-pressed={statusTab === s}
            data-testid={`movie-status-${s}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 网格 */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {filtered.map((work) => (
            <WorkCard key={work.id} work={work} showStatus onView={setSelected} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-text-secondary">该筛选条件下暂无影视作品</div>
      )}

      <WorkModal work={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
