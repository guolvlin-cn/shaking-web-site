import { useMemo } from 'react';
import type { Work } from '@shared/types';
import { Section } from '../common/Section';
import WorkCard from '../common/WorkCard';
import { useWorks } from '../../hooks/useContentQueries';
import { LoadingState } from '../common/AsyncState';

interface LatestWorksSectionProps {
  works?: Work[];
  onView?: (work: Work) => void;
}

const getLatest = (works: Work[], limit = 8): Work[] =>
  works
    .filter((w) => w.status === '已播出' || w.status === '热播中')
    .sort((a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''))
    .slice(0, limit);

export default function LatestWorksSection({ works, onView }: LatestWorksSectionProps) {
  const { data: fetched = [], isLoading } = useWorks();
  const list = useMemo(() => works ?? getLatest(fetched, 8), [works, fetched]);

  if (isLoading) {
    return (
      <Section id="latest" title="最新作品" moreLink="/works" moreText="全部">
        <LoadingState />
      </Section>
    );
  }

  return (
    <Section id="latest" title="最新作品" moreLink="/works" moreText="全部">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {list.map((work) => (
          <WorkCard key={work.id} work={work} onView={onView} />
        ))}
      </div>
    </Section>
  );
}
