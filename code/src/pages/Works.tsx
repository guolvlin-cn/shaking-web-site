import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { WORKS, type Work } from '../data/works';
import WorkCard from '../components/common/WorkCard';
import WorkModal from '../components/common/WorkModal';

const TABS: Array<{ key: string; label: string }> = [
  { key: '全部', label: '全部' },
  { key: '音乐', label: '音乐' },
  { key: '影视', label: '影视' },
  { key: '舞台', label: '舞台' },
  { key: '综艺', label: '综艺' },
  { key: '采访', label: '采访' },
];

const TYPE_MAP: Record<string, string[]> = {
  音乐: ['音乐'],
  影视: ['电视剧', '电影'],
  舞台: ['舞台'],
  综艺: ['综艺'],
  采访: ['采访'],
};

export default function Works() {
  const [activeTab, setActiveTab] = useState('全部');
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState<Work | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Ctrl+K 聚焦搜索
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = useMemo(() => {
    let list = WORKS.filter((w) => w.isPublished);
    if (activeTab !== '全部') {
      const types = TYPE_MAP[activeTab] ?? [];
      list = list.filter((w) => types.includes(w.type));
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter(
        (w) =>
          w.title.toLowerCase().includes(kw) ||
          (w.releaseDate ?? '').includes(kw) ||
          w.type.includes(kw) ||
          (w.tags ?? []).some((t) => t.toLowerCase().includes(kw)),
      );
    }
    return list;
  }, [activeTab, keyword]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-8" data-testid="page-works">
      <div className="section-title-accent">
        <h1 className="section-title text-3xl">作品合集</h1>
      </div>
      <p className="mt-2 text-text-secondary">音乐 · 影视 · 舞台 · 综艺 · 采访</p>

      {/* 分类 Tab */}
      <div className="mt-8 flex gap-6 border-b border-border md:gap-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`relative pb-3 text-sm transition-colors ${
              activeTab === tab.key
                ? 'font-semibold text-accent-gold'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            data-testid={`tab-${tab.key}`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent-gold" />
            )}
          </button>
        ))}
      </div>

      {/* 搜索框 */}
      <div className="mt-6 max-w-[400px]">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#666666]"
          />
          <input
            ref={searchRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索作品、年份、类型..."
            aria-label="搜索作品"
            data-testid="works-search"
            className="h-10 w-full rounded-full border border-border bg-bg-card pl-10 pr-4 text-sm text-text-primary placeholder:text-[#666666] transition-colors focus:border-accent-gold focus:shadow-[0_0_0_3px_rgba(245,197,24,0.15)] focus:outline-none"
          />
        </div>
      </div>

      {/* 卡片网格 */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {filtered.map((work) => (
            <WorkCard key={work.id} work={work} showStatus onView={setSelected} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-text-secondary" data-testid="works-empty">
          未找到相关作品
        </div>
      )}

      <WorkModal work={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
