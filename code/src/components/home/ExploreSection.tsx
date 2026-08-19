import { Link } from 'react-router-dom';
import { Music, Clapperboard, Tv, Sparkles, Mic, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Section } from '../common/Section';

const EXPLORE_ITEMS = [
  { to: '/music', title: '音乐专区', desc: '单曲 · EP · 舞台Live', icon: Music },
  { to: '/movies', title: '影视专区', desc: '电视剧 · 电影', icon: Clapperboard },
  { to: '/variety', title: '综艺专区', desc: '综艺 · 真人秀 · 选秀', icon: Tv },
  { to: '/stage', title: '舞台活动', desc: '晚会 · 音乐节', icon: Sparkles },
  { to: '/interview', title: '采访专区', desc: '专访 · 采访实录', icon: Mic },
  { to: '/gallery', title: '相册图库', desc: '舞台瞬间 · 写真', icon: ImageIcon },
];

export default function ExploreSection() {
  return (
    <Section id="explore" title="探索更多">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {EXPLORE_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex items-center gap-4 rounded-card border border-border bg-bg-card p-6 transition-all duration-300 hover:border-accent-gold hover:bg-accent-gold/5 hover:shadow-[0_0_20px_rgba(245,197,24,0.1)]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-bg-secondary text-text-secondary transition-colors group-hover:text-accent-gold">
              <item.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-h3 text-text-primary transition-colors group-hover:text-accent-gold">
                {item.title}
              </h3>
              <p className="mt-0.5 text-caption text-text-secondary">{item.desc}</p>
            </div>
            <ArrowRight
              size={18}
              className="text-text-secondary transition-all group-hover:translate-x-1 group-hover:text-accent-gold"
            />
          </Link>
        ))}
      </div>
    </Section>
  );
}
