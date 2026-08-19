import HeroSection from '../components/home/HeroSection';
import LatestWorksSection from '../components/home/LatestWorksSection';
import UpcomingSection from '../components/home/UpcomingSection';
import ExploreSection from '../components/home/ExploreSection';
import MilestonesSection from '../components/home/MilestonesSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="mx-auto max-w-[1280px]" data-testid="page-home">
        <LatestWorksSection />
        <UpcomingSection />
        <ExploreSection />
        <MilestonesSection />
      </div>
      <footer className="border-t border-border py-5 text-center text-caption text-[#666666]">
        © 2026 Shaking Chloe 谢可寅粉丝站 | 非官方网站，仅供粉丝交流使用
      </footer>
    </>
  );
}

