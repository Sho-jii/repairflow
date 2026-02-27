import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Bell, CheckCheck, AlertTriangle, Info, UserPlus, RefreshCw, AlertCircle, Inbox, Search } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { useNotificationStore } from '../lib/store';
import { formatDistanceToNow, isToday, isYesterday, isThisWeek, format } from 'date-fns';
import type { Notification } from '../lib/types';

const typeIcons: Record<string, typeof Bell> = {
  assignment: UserPlus,
  status_update: RefreshCw,
  overdue: AlertTriangle,
  sla_breach: AlertCircle,
  system: Info,
};

const typeColors: Record<string, string> = {
  assignment: 'text-blue-500 bg-blue-500/10',
  status_update: 'text-cyan-500 bg-cyan-500/10',
  overdue: 'text-orange-500 bg-orange-500/10',
  sla_breach: 'text-red-500 bg-red-500/10',
  system: 'text-gray-500 bg-gray-500/10',
};

const typeLabels: Record<string, string> = {
  all: 'All',
  assignment: 'Assignments',
  status_update: 'Status',
  overdue: 'Overdue',
  sla_breach: 'SLA',
  system: 'System',
};

function groupByDate(notifications: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = [];
  const todayItems: Notification[] = [];
  const yesterdayItems: Notification[] = [];
  const thisWeekItems: Notification[] = [];
  const olderItems: Notification[] = [];

  for (const n of notifications) {
    const d = new Date(n.createdAt);
    if (isToday(d)) todayItems.push(n);
    else if (isYesterday(d)) yesterdayItems.push(n);
    else if (isThisWeek(d)) thisWeekItems.push(n);
    else olderItems.push(n);
  }

  if (todayItems.length > 0) groups.push({ label: 'Today', items: todayItems });
  if (yesterdayItems.length > 0) groups.push({ label: 'Yesterday', items: yesterdayItems });
  if (thisWeekItems.length > 0) groups.push({ label: 'This Week', items: thisWeekItems });
  if (olderItems.length > 0) groups.push({ label: 'Earlier', items: olderItems });

  return groups;
}

export function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const [readFilter, setReadFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = [...notifications];
    if (readFilter === 'unread') result = result.filter(n => !n.read);
    if (typeFilter !== 'all') result = result.filter(n => n.type === typeFilter);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(n => n.title.toLowerCase().includes(s) || n.message.toLowerCase().includes(s));
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [notifications, readFilter, typeFilter, search]);

  const groups = groupByDate(filtered);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: notifications.length };
    for (const n of notifications) {
      counts[n.type] = (counts[n.type] || 0) + 1;
    }
    return counts;
  }, [notifications]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Notifications</h1>
          <p className="text-muted-foreground text-sm">
            {unreadCount} unread of {notifications.length} total
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 self-start sm:self-auto" onClick={markAllAsRead} disabled={unreadCount === 0}>
          <CheckCheck className="w-4 h-4" /> Mark all as read
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-input-background"
          />
        </div>

        {/* Read/Unread Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setReadFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs transition-all ${readFilter === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              All
            </button>
            <button
              onClick={() => setReadFilter('unread')}
              className={`px-3 py-1.5 rounded-md text-xs transition-all flex items-center gap-1.5 ${readFilter === 'unread' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="h-4 min-w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none">
          {Object.entries(typeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs border transition-all ${
                typeFilter === key
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
              }`}
            >
              {label}
              <span className="ml-1 opacity-60">{typeCounts[key] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Notifications */}
      <div className="space-y-6">
        {groups.map(group => (
          <div key={group.label}>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{group.label}</p>
              <Separator className="flex-1" />
              <Badge variant="secondary" className="text-[10px]">{group.items.length}</Badge>
            </div>
            <div className="space-y-2">
              {group.items.map((notification, i) => {
                const Icon = typeIcons[notification.type] || Bell;
                const colorClass = typeColors[notification.type] || 'text-gray-500 bg-gray-500/10';

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <Card
                      className={`border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer hover:shadow-md hover:bg-card/95 transition-all ${!notification.read ? 'border-l-2 border-l-primary' : ''}`}
                      onClick={() => { markAsRead(notification.id); if (notification.link) navigate(notification.link); }}
                    >
                      <CardContent className="p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${colorClass}`}>
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm truncate" style={{ fontWeight: notification.read ? 400 : 600 }}>
                              {notification.title}
                            </p>
                            {!notification.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                            <span className="text-[10px] text-muted-foreground hidden sm:inline">
                              · {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-[10px] capitalize shrink-0 hidden sm:inline-flex">
                          {notification.type.replace('_', ' ')}
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Inbox className="w-14 h-14 mx-auto mb-3 opacity-20" />
            <p style={{ fontWeight: 500 }}>No notifications found</p>
            <p className="text-sm mt-1">
              {search || typeFilter !== 'all' || readFilter !== 'all'
                ? 'Try adjusting your filters'
                : "You're all caught up!"}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}