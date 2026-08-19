import { useEffect } from 'react';
import { X, ExternalLink, Play } from 'lucide-react';
import type { Work } from '../../data/works';
import { TYPE_TAG_COLORS } from '../../data/site';

interface WorkModalProps {
  work: Work | null;
  onClose: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  已播出: 'bg-[#52c41a20] text-[#52c41a] border-[#52c41a40]',
  即将上线: 'bg-[#1890ff20] text-[#1890ff] border-[#1890ff40]',
  热播中: 'bg-[#ff6b6b20] text-[#ff6b6b] border-[#ff6b6b40]',
  筹备中: 'bg-[#ff9f4320] text-[#ff9f43] border-[#ff9f4340]',
  待官宣: 'bg-[#5f27cd20] text-[#b388ff] border-[#5f27cd40]',
};

export default function WorkModal({ work, onClose }: WorkModalProps) {
  useEffect(() => {
    if (!work) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [work, onClose]);

  if (!work) return null;

  const tagClass = TYPE_TAG_COLORS[work.type] ?? 'bg-border';
  const statusStyle = STATUS_STYLES[work.status] ?? STATUS_STYLES['已播出'];

  return (
    <div
      className="fixed inset-0 z-[800] flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${work.title} 详情`}
      data-testid="work-modal"
    >
      <div
        className="relative grid w-full max-w-[900px] gap-6 overflow-hidden rounded-card border border-border bg-bg-card p-6 md:grid-cols-[40%_60%] md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭详情"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-secondary text-text-secondary transition-colors hover:border-accent-gold hover:text-accent-gold"
        >
          <X size={18} />
        </button>

        {/* 海报 */}
        <div
          className="relative aspect-[3/4] w-full overflow-hidden rounded-card"
          style={{ background: work.gradient }}
          role="img"
          aria-label={`${work.title} 海报`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Play size={48} className="text-white/60" />
          </div>
        </div>

        {/* 信息 */}
        <div className="flex flex-col">
          <h2 className="text-h1 text-text-primary">{work.title}</h2>
          <div className="mt-2 flex items-center gap-2">
            <span className={`rounded px-2 py-0.5 text-caption text-white ${tagClass}`}>
              {work.type}
            </span>
            <span className={`rounded border px-2 py-0.5 text-caption ${statusStyle}`}>
              {work.status}
            </span>
          </div>

          <p className="mt-4 text-body text-text-secondary">
            {work.description ?? '暂无简介'}
          </p>

          <dl className="mt-5 space-y-2 text-sm">
            {work.releaseDate && (
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-text-secondary">时间</dt>
                <dd className="text-text-primary">{work.releaseDate}</dd>
              </div>
            )}
            {work.role && (
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-text-secondary">谢可寅角色</dt>
                <dd className="font-medium text-accent-gold">{work.role}</dd>
              </div>
            )}
            {work.platform && (
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-text-secondary">播出平台</dt>
                <dd className="text-text-primary">{work.platform}</dd>
              </div>
            )}
            {work.tags && work.tags.length > 0 && (
              <div className="flex gap-2">
                <dt className="w-20 shrink-0 text-text-secondary">标签</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {work.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded border border-border px-1.5 py-0.5 text-caption text-text-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>

          {work.externalLink && (
            <a
              href={work.externalLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-accent-gold px-6 py-2.5 text-sm font-semibold text-bg-base transition-colors hover:bg-accent-goldBright"
              data-testid="work-modal-link"
            >
              去观看
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
