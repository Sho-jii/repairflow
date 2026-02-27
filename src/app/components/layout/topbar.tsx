import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Bell, Search, Sun, Moon, Menu, Command, UserPlus, RefreshCw, AlertTriangle, AlertCircle, Info, CheckCheck, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { useAuthStore, useNotificationStore } from '../../lib/store';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { ScrollArea } from '../ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { MobileSidebar } from './mobile-sidebar';

export function Topbar() {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'dark';
  });
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setCmdOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <>
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[260px]">
              <MobileSidebar />
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2 text-muted-foreground h-9 w-64 justify-start"
            onClick={() => setCmdOpen(true)}
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Search...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] text-muted-foreground">
              <Command className="w-3 h-3" />K
            </kbd>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] sm:w-[380px] p-0 border-border bg-popover shadow-2xl rounded-xl overflow-hidden" align="end" sideOffset={8}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm" style={{ fontWeight: 600 }}>Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="h-5 min-w-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center px-1.5" style={{ fontWeight: 600 }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground" onClick={markAllAsRead}>
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </Button>
                )}
              </div>

              {/* Notification List */}
              <ScrollArea className="h-[320px]">
                <div className="py-1">
                  {(() => {
                    const sorted = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    const preview = sorted.slice(0, 8);
                    const typeIconMap: Record<string, typeof Bell> = {
                      assignment: UserPlus,
                      status_update: RefreshCw,
                      overdue: AlertTriangle,
                      sla_breach: AlertCircle,
                      system: Info,
                    };
                    const typeColorMap: Record<string, string> = {
                      assignment: 'text-blue-400 bg-blue-500/10',
                      status_update: 'text-cyan-400 bg-cyan-500/10',
                      overdue: 'text-orange-400 bg-orange-500/10',
                      sla_breach: 'text-red-400 bg-red-500/10',
                      system: 'text-gray-400 bg-gray-500/10',
                    };

                    if (preview.length === 0) {
                      return (
                        <div className="py-10 text-center text-muted-foreground">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-xs">No notifications yet</p>
                        </div>
                      );
                    }

                    return preview.map((n) => {
                      const Icon = typeIconMap[n.type] || Bell;
                      const colorClass = typeColorMap[n.type] || 'text-gray-400 bg-gray-500/10';
                      return (
                        <div
                          key={n.id}
                          className={`flex items-start gap-2.5 px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50 group ${!n.read ? 'bg-primary/[0.04]' : ''}`}
                          onClick={() => { markAsRead(n.id); if (n.link) navigate(n.link); }}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${colorClass}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm truncate" style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</p>
                              {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground/70 mt-1">
                              {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="px-3 py-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/notifications')}
                >
                  View all notifications <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm">{user?.name}</span>
                <Badge variant="secondary" className="hidden sm:inline text-[10px] capitalize">
                  {user?.role}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/notifications')}>Notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => { navigate('/dashboard'); setCmdOpen(false); }}>Dashboard</CommandItem>
            <CommandItem onSelect={() => { navigate('/tickets'); setCmdOpen(false); }}>Tickets</CommandItem>
            <CommandItem onSelect={() => { navigate('/technicians'); setCmdOpen(false); }}>Technicians</CommandItem>
            <CommandItem onSelect={() => { navigate('/customers'); setCmdOpen(false); }}>Customers</CommandItem>
            <CommandItem onSelect={() => { navigate('/reports'); setCmdOpen(false); }}>Reports</CommandItem>
            <CommandItem onSelect={() => { navigate('/settings'); setCmdOpen(false); }}>Settings</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { navigate('/tickets?create=true'); setCmdOpen(false); }}>Create new ticket</CommandItem>
            <CommandItem onSelect={() => { navigate('/reports'); setCmdOpen(false); }}>Generate report</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}