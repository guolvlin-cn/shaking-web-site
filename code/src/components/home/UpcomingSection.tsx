import { Section } from '../common/Section';
import type { Work } from '../../data/works';
import { getUpcomingWorks } from '../../data/works';

const STATUS_STYLES: Record<string, string> = {
  即将上线: 'bg-[#1890ff20] text-[#1890ff] border-[#1890ff40]',
  筹备中: 'bg-[#ff9f4320] text-[#ff9f43] border-[#ff9f4340]',
  待官宣: 'bg-[#5f27cd20] text-[#b388ff] border-[#5f27cd40]',
};

interface UpcomingSectionProps {
  works?: Work[];
}

export default function UpcomingSection({ works }: UpcomingSectionProps) {
  const list = works ?? getUpcomingWorks();

  return (
    <Section id="upcoming" title="敬请期待">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((work) => {
          const statusStyle = STATUS_STYLES[work.status] ?? STATUS_STYLES['筹备中'];
          return (
            <article
              key={work.id}
              className="group relative overflow-hidden rounded-card border border-border bg-bg-card transition-all duration-300 hover:border-accent-gold hover:shadow-[0_0_20px_rgba(245,197,24,0.15)]"
              data-testid={`upcoming-card-${work.id}`}
            >
              <div
                className="relative aspect-[3/4] w-full"
                style={{ background: work.gradient }}
                role="img"
                aria-label={`${work.title} 封面`}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="rotate-[-8deg] rounded border-2 border-accent-gold px-4 py-2 text-h3 font-bold tracking-widest text-accent-gold">
                    敬请期待
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-h3 text-text-primary">《{work.title}》</h3>
                <p className="mt-1 text-caption text-text-secondary">
                  {work.type} {work.category ? `| ${work.category}` : ''}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span
                    className={`rounded border px-2 py-0.5 text-caption ${statusStyle}`}
                  >
                    {work.status}
                  </span>
                  {work.releaseDate && (
                    <span className="text-caption text-accent-gold">{work.releaseDate}</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
