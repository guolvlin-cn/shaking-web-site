import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Film,
  Music,
  Clapperboard,
  Sparkles,
  Tv,
  Mic,
  Image as ImageIcon,
  User,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: '作品',
    items: [
      { to: '/works', label: '作品合集', icon: Film },
      { to: '/music', label: '音乐专区', icon: Music },
      { to: '/movies', label: '影视专区', icon: Clapperboard },
      { to: '/stage', label: '舞台活动', icon: Sparkles },
      { to: '/variety', label: '综艺专区', icon: Tv },
      { to: '/interview', label: '采访专区', icon: Mic },
    ],
  },
  {
    title: '其他',
    items: [
      { to: '/gallery', label: '相册图库', icon: ImageIcon },
      { to: '/about', label: '关于谢可寅', icon: User },
      { to: '/chat', label: '问答机器人', icon: MessageCircle },
    ],
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const groups = useMemo(() => NAV_GROUPS, []);

  return (
    <aside
      className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] flex-col border-r border-border bg-bg-secondary transition-all duration-300 ${
        sidebarCollapsed ? 'w-[72px]' : 'w-[200px]'
      } hidden md:flex`}
      aria-label="侧边导航"
    >
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {groups.map((group) => (
          <div key={group.title} className="mb-4">
            {!sidebarCollapsed && (
              <div className="px-3 pb-2 text-caption text-text-secondary">{group.title}</div>
            )}
            <ul>
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `group relative flex h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-accent-gold'
                          : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                      }`
                    }
                    title={item.label}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded bg-accent-gold" />
                        )}
                        <item.icon size={20} strokeWidth={2} />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
          aria-label={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          {!sidebarCollapsed && <span className="text-sm">收起</span>}
        </button>
      </div>
    </aside>
  );
}
