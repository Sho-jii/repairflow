import { Outlet, Navigate } from 'react-router';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { AnimatedBackground } from '../animated-background';
import { useAuthStore } from '../../lib/store';
import { Toaster } from 'sonner';

export function RootLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AnimatedBackground />
      <div className="hidden lg:block relative z-30">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="p-3 sm:p-4 lg:p-6 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster position="top-right" richColors theme="dark" />
    </div>
  );
}