import { Section } from '../common/Section';
import WorkCard from '../common/WorkCard';
import type { Work } from '../../data/works';
import { getLatestWorks } from '../../data/works';

interface LatestWorksSectionProps {
  works?: Work[];
  onView?: (work: Work) => void;
}

export default function LatestWorksSection({ works, onView }: LatestWorksSectionProps) {
  const list = works ?? getLatestWorks(8);

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
