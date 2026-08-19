import { Link } from 'react-router-dom';
import { Section } from '../common/Section';

const MILESTONES = [
  { year: '2020', title: '出道', desc: '《青春有你2》以第三名出道，加入 THE9' },
  { year: '2022', title: '影视', desc: '《中国说唱巅峰对决》· 演员之路开启' },
  { year: '2024', title: '音乐', desc: '个人单曲发布 · 文荣奖年度瞩目青年演员' },
  { year: '2026', title: '全能', desc: '影视 × 音乐 × 舞台 全面开花' },
];

export default function MilestonesSection() {
  return (
    <Section id="milestones" title="成长足迹" moreLink="/timeline" moreText="全部">
      <div className="relative">
        {/* 连线 */}
        <div className="absolute left-0 right-0 top-2 hidden h-px bg-[#3a3a3a] md:block" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-4">
          {MILESTONES.map((m) => (
            <div key={m.year} className="relative flex flex-col gap-2 md:items-center md:text-center">
              <span className="z-10 h-4 w-4 rounded-full border-2 border-accent-gold bg-bg-base" />
              <div>
                <div className="text-h3 text-accent-gold">{m.year}</div>
                <div className="text-sm font-semibold text-text-primary">{m.title}</div>
                <p className="mt-1 text-caption text-text-secondary">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 md:hidden">
          <Link
            to="/timeline"
            className="text-sm text-accent-gold transition-colors hover:underline"
          >
            查看完整时间线 →
          </Link>
        </div>
      </div>
    </Section>
  );
}
