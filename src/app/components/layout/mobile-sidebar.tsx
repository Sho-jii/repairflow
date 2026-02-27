import { NavLink, useLocation } from 'react-router';
import { LayoutDashboard, Ticket, Users, UserCircle, BarChart3, Bell, Settings, Shield, Wrench, Printer } from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { cn } from '../ui/utils';
import type { Role } from '../../lib/types';
import { Separator } from '../ui/separator';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'technician'] as Role[] },
  { path: '/tickets', label: 'Tickets', icon: Ticket, roles: ['admin', 'manager', 'technician'] as Role[] },
  { path: '/technicians', label: 'Technicians', icon: Wrench, roles: ['admin', 'manager'] as Role[] },
  { path: '/customers', label: 'Customers', icon: UserCircle, roles: ['admin', 'manager'] as Role[] },
  { path: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'manager', 'technician'] as Role[] },
  { path: '/notifications', label: 'Notifications', icon: Bell, roles: ['admin', 'manager', 'technician'] as Role[] },
  { path: '/settings', label: 'Settings', icon: Settings, roles: ['admin', 'manager'] as Role[] },
  { path: '/audit-logs', label: 'Audit Logs', icon: Shield, roles: ['admin', 'manager'] as Role[] },
];

export function MobileSidebar() {
  const { user } = useAuthStore();
  const location = useLocation();
  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex flex-col h-full bg-sidebar pt-4">
      <div className="flex items-center gap-3 px-4 mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
          <Printer className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-sidebar-foreground tracking-tight" style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em' }}>RepairFlow</span>
      </div>
      <Separator />
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {filteredNav.map(item => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}