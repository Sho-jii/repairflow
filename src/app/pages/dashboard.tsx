import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Ticket, Clock, CheckCircle2, AlertTriangle, Plus, Users, FileText,
  TrendingUp, ArrowUpRight, Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { useTicketStore, useTechnicianStore, useAuthStore } from '../lib/store';
import { chartData } from '../lib/mock-data';
import { ChartTooltip } from '../components/ui/chart-tooltip';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DashboardPage() {
  const { tickets } = useTicketStore();
  const { technicians } = useTechnicianStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const open = tickets.filter(t => ['pending', 'assigned'].includes(t.status)).length;
  const inProgress = tickets.filter(t => t.status === 'in_progress').length;
  const completed = tickets.filter(t => t.status === 'completed').length;
  const overdue = tickets.filter(t => new Date(t.slaDeadline) < new Date() && !['completed', 'closed'].includes(t.status)).length;

  const [animatedOpen, setAnimatedOpen] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [animatedCompleted, setAnimatedCompleted] = useState(0);
  const [animatedOverdue, setAnimatedOverdue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedOpen(open);
      setAnimatedProgress(inProgress);
      setAnimatedCompleted(completed);
      setAnimatedOverdue(overdue);
    }, 300);
    return () => clearTimeout(timer);
  }, [open, inProgress, completed, overdue]);

  const kpis = [
    { label: 'Open Tickets', value: animatedOpen, icon: Ticket, color: 'text-chart-1', bg: 'bg-chart-1/10', trend: '+2 today' },
    { label: 'In Progress', value: animatedProgress, icon: Clock, color: 'text-chart-2', bg: 'bg-chart-2/10', trend: 'Active now' },
    { label: 'Completed', value: animatedCompleted, icon: CheckCircle2, color: 'text-chart-4', bg: 'bg-chart-4/10', trend: '+3 this week' },
    { label: 'Overdue', value: animatedOverdue, icon: AlertTriangle, color: 'text-chart-5', bg: 'bg-chart-5/10', trend: 'Needs attention' },
  ];

  const COLORS = ['#818cf8', '#22d3ee', '#fbbf24', '#34d399', '#fb7185'];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2 }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Here's what's happening with your service operations today.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/tickets?create=true')} className="gap-2">
            <Plus className="w-4 h-4" /> New Ticket
          </Button>
          <Button variant="outline" onClick={() => navigate('/reports')} className="gap-2">
            <FileText className="w-4 h-4" /> Reports
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} variants={itemVariants}>
            <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden relative">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] sm:text-sm text-muted-foreground">{kpi.label}</p>
                    <motion.p
                      key={kpi.value}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-0.5 sm:mt-1"
                      style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)', fontWeight: 700, lineHeight: 1 }}
                    >
                      {kpi.value}
                    </motion.p>
                    <p className={`text-[10px] sm:text-xs mt-1 sm:mt-2 ${kpi.color} hidden sm:block`}>{kpi.trend}</p>
                  </div>
                  <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl ${kpi.bg} group-hover:scale-110 transition-transform`}>
                    <kpi.icon className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${kpi.bg}`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Weekly Activity</CardTitle>
              <Badge variant="secondary" className="text-xs">This week</Badge>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="h-[180px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                  <BarChart data={chartData.weeklyActivity} barGap={4}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: 'var(--foreground)', opacity: 0.05, radius: 4 }}
                    />
                    <Bar dataKey="created" name="Created" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" name="Completed" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Distribution */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Service Distribution</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="h-[180px] sm:h-[200px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                  <PieChart>
                    <Pie
                      data={chartData.serviceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      activeIndex={undefined}
                      activeShape={undefined}
                    >
                      {chartData.serviceDistribution.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} className="transition-opacity duration-200 hover:opacity-80" />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<ChartTooltip indicator="dot" />}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {chartData.serviceDistribution.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    {item.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Technicians */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Top Technicians</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate('/technicians')}>
                View all <ArrowUpRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {technicians.sort((a, b) => b.metrics.jobsCompleted - a.metrics.jobsCompleted).map((tech, i) => (
                <div key={tech.id} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-5">{i + 1}</span>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={tech.avatar} />
                    <AvatarFallback>{tech.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{tech.specialization}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm" style={{ fontWeight: 600 }}>{tech.metrics.jobsCompleted}</p>
                    <p className="text-xs text-muted-foreground">jobs</p>
                  </div>
                  <div className="w-20 hidden sm:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-chart-3">★</span>
                      <span className="text-xs">{tech.metrics.customerRating}</span>
                    </div>
                    <Progress value={tech.metrics.customerRating * 20} className="h-1 mt-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Tickets */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Recent Tickets</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate('/tickets')}>
                View all <ArrowUpRight className="w-3 h-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {tickets.slice(0, 5).map(ticket => (
                <div
                  key={ticket.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{ticket.id}</span>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <p className="text-sm truncate mt-0.5">{ticket.title}</p>
                  </div>
                  <PriorityBadge priority={ticket.priority} />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-chart-3" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/tickets?create=true')}>
                <Plus className="w-4 h-4" /> Create Ticket
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/technicians')}>
                <Users className="w-4 h-4" /> Assign Tech
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/reports')}>
                <FileText className="w-4 h-4" /> Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    assigned: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    in_progress: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    waiting_parts: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    closed: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  const labels: Record<string, string> = {
    pending: 'Pending', assigned: 'Assigned', in_progress: 'In Progress',
    waiting_parts: 'Waiting Parts', completed: 'Completed', closed: 'Closed',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${styles[status] || ''}`}>
      {labels[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    low: 'bg-gray-500/10 text-gray-400',
    medium: 'bg-yellow-500/10 text-yellow-500',
    high: 'bg-orange-500/10 text-orange-500',
    urgent: 'bg-red-500/10 text-red-500',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] ${styles[priority] || ''}`}>
      {priority}
    </span>
  );
}