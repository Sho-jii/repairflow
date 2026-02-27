import { NavLink, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Ticket, Users, UserCircle, BarChart3,
  Bell, Settings, Shield, LogOut, Printer, Wrench,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';
import { useState } from 'react';
import type { Role } from '../../lib/types';
import { cn } from '../ui/utils';

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

const sidebarSpring = { type: 'spring' as const, stiffness: 260, damping: 28, mass: 0.8 };
const labelSpring = { type: 'spring' as const, stiffness: 300, damping: 25 };

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const location = useLocation();

  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 76 : 264 }}
        transition={sidebarSpring}
        className="h-screen sticky top-0 flex flex-col z-30 relative overflow-visible"
        style={{
          background: 'var(--sidebar)',
          borderRight: '1px solid var(--sidebar-border)',
        }}
      >
        {/* Subtle inner glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(ellipse at 0% 0%, var(--primary) 0%, transparent 60%)',
            opacity: 0.03,
          }}
        />

        {/* ─── Logo area ─── */}
        <div className="flex items-center h-16 px-4 gap-3 relative z-10">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden"
            style={{ background: 'var(--primary)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Printer className="w-5 h-5 text-primary-foreground relative z-10" />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, x: -8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -8, filter: 'blur(4px)' }}
                transition={labelSpring}
                className="text-sidebar-foreground whitespace-nowrap"
                style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.025em' }}
              >
                RepairFlow
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Divider ─── */}
        <div className="mx-4 h-px" style={{ background: 'var(--sidebar-border)' }} />

        {/* ─── Navigation ─── */}
        <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto overflow-x-hidden relative z-10">
          {filteredNav.map((item, index) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            const isHovered = hovered === item.path;

            const link = (
              <NavLink
                key={item.path}
                to={item.path}
                onMouseEnter={() => setHovered(item.path)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl relative overflow-hidden group',
                  'transition-colors duration-200',
                  !isActive && 'text-muted-foreground',
                )}
                style={{ minHeight: 44 }}
              >
                {/* Active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                      boxShadow: '0 0 0 1px color-mix(in srgb, var(--primary) 8%, transparent)',
                    }}
                    transition={sidebarSpring}
                  />
                )}

                {/* Hover background */}
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'color-mix(in srgb, var(--accent) 60%, transparent)' }}
                    />
                  )}
                </AnimatePresence>

                {/* Active left indicator line */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator-line"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{ background: 'var(--primary)' }}
                    transition={sidebarSpring}
                  />
                )}

                {/* Icon with animation */}
                <motion.div
                  className="relative z-10 shrink-0 flex items-center justify-center"
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    color: isActive ? 'var(--primary)' : undefined,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <item.icon className={cn(
                    'w-[20px] h-[20px] transition-colors duration-200',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                  )} />
                  {/* Active glow behind icon */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'var(--primary)',
                        filter: 'blur(8px)',
                        opacity: 0.2,
                      }}
                      animate={{ opacity: [0.15, 0.25, 0.15] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </motion.div>

                {/* Label text */}
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      key={`label-${item.path}`}
                      initial={{ opacity: 0, x: -6, filter: 'blur(3px)' }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        filter: 'blur(0px)',
                        transition: { ...labelSpring, delay: index * 0.02 },
                      }}
                      exit={{
                        opacity: 0,
                        x: -6,
                        filter: 'blur(3px)',
                        transition: { duration: 0.15 },
                      }}
                      className={cn(
                        'text-sm whitespace-nowrap relative z-10 transition-colors duration-200',
                        isActive ? 'text-primary' : 'group-hover:text-foreground',
                      )}
                      style={{ fontWeight: isActive ? 600 : 400 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={12}
                    className="px-3 py-1.5 text-xs"
                    style={{ fontWeight: 500 }}
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return link;
          })}
        </nav>

        {/* ─── Divider ─── */}
        <div className="mx-4 h-px" style={{ background: 'var(--sidebar-border)' }} />

        {/* ─── User section ─── */}
        <div className="p-3 relative z-10">
          <motion.div
            className={cn(
              'flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors duration-200',
              collapsed ? 'justify-center' : 'hover:bg-accent/40',
            )}
            layout
            transition={sidebarSpring}
          >
            <motion.div layout transition={sidebarSpring} className="shrink-0">
              <Avatar className="h-9 w-9 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-300">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600 }}>
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </motion.div>

            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0, x: -6, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -6, filter: 'blur(3px)' }}
                  transition={labelSpring}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm truncate text-sidebar-foreground" style={{ fontWeight: 500 }}>{user?.name}</p>
                  <p className="text-[11px] text-muted-foreground capitalize">{user?.role}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  key="logout-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                        onClick={logout}
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Sign out</TooltipContent>
                  </Tooltip>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ─── Floating collapse toggle ─── */}
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3.5 top-20 z-50 flex items-center justify-center w-7 h-7 rounded-full cursor-pointer"
          style={{
            background: 'var(--sidebar)',
            border: '1px solid var(--sidebar-border)',
            boxShadow: '0 2px 8px -2px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.04)',
            color: 'var(--muted-foreground)',
          }}
          whileHover={{
            scale: 1.15,
            boxShadow: '0 4px 16px -4px rgba(0,0,0,0.3), 0 0 0 1px var(--primary)',
            color: 'var(--primary)',
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={sidebarSpring}
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </motion.div>
        </motion.button>
      </motion.aside>
    </TooltipProvider>
  );
}
