import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Star, CheckCircle2, LogIn, LogOut, Eye, List, LayoutGrid } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { useTechnicianStore, useTicketStore } from '../lib/store';
import { StatusBadge } from './dashboard';
import { format } from 'date-fns';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  available: 'bg-green-500',
  busy: 'bg-yellow-500',
  offline: 'bg-gray-500',
  on_break: 'bg-orange-500',
};

export function TechniciansPage() {
  const { technicians, toggleCheckIn } = useTechnicianStore();
  const { tickets } = useTicketStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const handleCheckIn = (id: string, name: string, checkedIn: boolean) => {
    toggleCheckIn(id);
    toast.success(checkedIn ? 'Checked out' : 'Checked in', { description: `${name} ${checkedIn ? 'checked out' : 'checked in'} successfully.` });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Technicians</h1>
          <p className="text-muted-foreground text-sm">{technicians.length} team members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={view === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setView('grid')}>
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button variant={view === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setView('list')}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4' : 'space-y-3'}>
        {technicians.map((tech, i) => {
          const techTickets = tickets.filter(t => t.technicianId === tech.id && !['completed', 'closed'].includes(t.status));

          return (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all group">
                <CardContent className="p-3 sm:p-5">
                  {/* Header */}
                  <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="relative">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarImage src={tech.avatar} />
                        <AvatarFallback>{tech.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-card ${statusColors[tech.status]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontWeight: 600 }} className="text-sm truncate">{tech.name}</p>
                      <p className="text-[11px] sm:text-xs text-muted-foreground truncate">{tech.specialization}</p>
                      <Badge variant="secondary" className="text-[10px] capitalize mt-0.5 sm:mt-1">{tech.status.replace('_', ' ')}</Badge>
                    </div>
                    <Button
                      variant={tech.checkedIn ? 'destructive' : 'default'}
                      size="sm"
                      className="text-[11px] gap-1 h-7 px-2 sm:px-3"
                      onClick={() => handleCheckIn(tech.id, tech.name, tech.checkedIn)}
                    >
                      {tech.checkedIn ? <><LogOut className="w-3 h-3" /> Out</> : <><LogIn className="w-3 h-3" /> In</>}
                    </Button>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-muted/50">
                      <p className="text-[10px] text-muted-foreground">Jobs Done</p>
                      <p style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: 700 }}>{tech.metrics.jobsCompleted}</p>
                    </div>
                    <div className="p-1.5 sm:p-2 rounded-lg bg-muted/50">
                      <p className="text-[10px] text-muted-foreground">Avg Time</p>
                      <p style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: 700 }}>{tech.metrics.avgResolutionTime}h</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Star className="w-4 h-4 text-chart-3 fill-chart-3" />
                    <span className="text-sm">{tech.metrics.customerRating}</span>
                    <Progress value={tech.metrics.customerRating * 20} className="flex-1 h-1.5" />
                  </div>

                  {/* Location */}
                  {tech.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3" />
                      <span>{tech.location.label}</span>
                    </div>
                  )}

                  {/* Check-in time */}
                  {tech.checkInTime && tech.checkedIn && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Clock className="w-3 h-3" />
                      <span>Checked in {format(new Date(tech.checkInTime), 'h:mm a')}</span>
                    </div>
                  )}

                  {/* Active Tickets */}
                  {techTickets.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground">Active Tickets ({techTickets.length})</p>
                      {techTickets.slice(0, 3).map(t => (
                        <div key={t.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-muted/30">
                          <span className="text-muted-foreground">{t.id}</span>
                          <span className="truncate mx-2 flex-1">{t.title}</span>
                          <StatusBadge status={t.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Map Placeholder */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Location Tracking (Demo)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] rounded-xl bg-muted/30 border border-dashed border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Map integration placeholder</p>
              <p className="text-xs mt-1">Would show real-time technician locations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}