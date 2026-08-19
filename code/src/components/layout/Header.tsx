import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  Home as HomeIcon,
  Film,
  Music,
  Image as ImageIcon,
  User,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import Sidebar from './Sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/': '首页',
  '/timeline': '成长时间线',
  '/works': '作品合集',
  '/music': '音乐专区',
  '/movies': '影视专区',
  '/stage': '舞台活动',
  '/variety': '综艺专区',
  '/interview': '采访专区',
  '/gallery': '相册图库',
  '/about': '关于谢可寅',
  '/chat': '问答机器人',
};

const SOCIAL_LINKS = [
  { name: '微博', href: 'https://weibo.com/u/谢可寅' },
  { name: '抖音', href: 'https://www.douyin.com/user/谢可寅' },
  { name: '小红书', href: 'https://www.xiaohongshu.com/user/profile/谢可寅' },
  { name: 'Instagram', href: 'https://www.instagram.com/shaking_chole' },
];

export default function Header() {
  const { mobileMenuOpen, setMobileMenuOpen, closeMobileMenu } = useUIStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Shaking Chloe';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex h-16 items-center gap-4 px-4 transition-all duration-300 md:px-6 ${
          scrolled
            ? 'border-b border-border bg-bg-base/95 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-text-primary hover:bg-white/5 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <img src="/logo.svg" alt="Shaking Chloe Logo" className="h-8 w-8" />
          <span className="hidden text-h3 text-text-primary transition-colors hover:text-accent-gold sm:inline">
            Shaking Chloe
          </span>
        </Link>

        <div className="ml-2 hidden items-center gap-2 border-l border-border pl-4 md:flex">
          <span className="h-6 w-[2px] rounded bg-accent-gold" />
          <span className="text-base font-semibold text-text-primary">{pageTitle}</span>
        </div>

        <div className="flex-1" />

        <Link
          to="/works"
          className="hidden h-9 w-60 items-center gap-2 rounded-full bg-bg-card px-4 text-sm text-text-secondary transition-colors hover:border hover:border-accent-gold focus:border focus:border-accent-gold focus:outline-none lg:flex"
          aria-label="搜索（Ctrl+K）"
        >
          <Search size={16} />
          <span className="flex-1">搜索作品…</span>
          <kbd className="rounded border border-border px-1.5 text-caption text-text-secondary">Ctrl K</kbd>
        </Link>

        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-text-secondary transition-colors hover:text-accent-gold"
              aria-label={s.name}
            >
              {s.name}
            </a>
          ))}
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/60 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}
      <Sidebar
        onNavigate={() => {
          setMobileMenuOpen(false);
        }}
      />

      {/* 移动端底部导航 */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-border bg-bg-secondary md:hidden"
        aria-label="底部导航"
      >
        {[
          { to: '/', label: '首页', icon: HomeIcon },
          { to: '/works', label: '作品', icon: Film },
          { to: '/music', label: '音乐', icon: Music },
          { to: '/gallery', label: '相册', icon: ImageIcon },
          { to: '/about', label: '关于', icon: User },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-0.5 text-caption text-text-secondary"
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
