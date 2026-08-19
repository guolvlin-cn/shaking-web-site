import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useUIStore } from '../../stores/uiStore';

export default function AppLayout() {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen">
      <Header />
      <main
        className={`px-4 pb-20 pt-16 transition-all duration-300 md:px-8 md:pb-8 ${
          sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-[200px]'
        }`}
      >
        <div className="mx-auto max-w-[1440px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
