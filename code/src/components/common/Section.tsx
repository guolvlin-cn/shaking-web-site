import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  id?: string;
  title: string;
  moreLink?: string;
  moreText?: string;
}

export function SectionHeader({ id, title, moreLink, moreText = '更多' }: SectionHeaderProps) {
  return (
    <div id={id} className="mb-6 flex items-center justify-between scroll-mt-24">
      <div className="section-title-accent">
        <h2 className="section-title text-2xl">{title}</h2>
      </div>
      {moreLink && (
        <Link
          to={moreLink}
          className="flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent-gold"
        >
          {moreText}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

interface SectionProps extends SectionHeaderProps {
  children: ReactNode;
}

export function Section({ id, title, moreLink, moreText, children }: SectionProps) {
  return (
    <section className="py-10 md:py-16">
      <SectionHeader id={id} title={title} moreLink={moreLink} moreText={moreText} />
      {children}
    </section>
  );
}
