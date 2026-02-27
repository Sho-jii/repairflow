import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, FileText, Printer, Calendar, TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import { useTicketStore, useTechnicianStore } from '../lib/store';
import { chartData } from '../lib/mock-data';
import { toast } from 'sonner';
import { ChartTooltip } from '../components/ui/chart-tooltip';

const COLORS = ['#818cf8', '#22d3ee', '#fbbf24', '#34d399', '#fb7185'];

export function ReportsPage() {
  const { tickets } = useTicketStore();
  const { technicians } = useTechnicianStore();
  const [range, setRange] = useState('week');

  const exportCSV = () => {
    const headers = 'ID,Title,Status,Priority,Customer,Technician,Created\n';
    const rows = tickets.map(t => `${t.id},${t.title},${t.status},${t.priority},${t.customerName},${t.technicianName || 'N/A'},${t.createdAt}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repairflow-report.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported', { description: 'Report downloaded successfully.' });
  };

  const exportPDF = () => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html><head><title>RepairFlow Report</title><style>
          body { font-family: system-ui; padding: 40px; }
          h1 { color: #333; } table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
          th { background: #f5f5f5; }
        </style></head><body>
        <h1>RepairFlow Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <table><tr><th>ID</th><th>Title</th><th>Status</th><th>Priority</th><th>Customer</th></tr>
        ${tickets.map(t => `<tr><td>${t.id}</td><td>${t.title}</td><td>${t.status}</td><td>${t.priority}</td><td>${t.customerName}</td></tr>`).join('')}
        </table></body></html>
      `);
      win.document.close();
      win.print();
    }
    toast.success('PDF view opened', { description: 'Print dialog opened in new tab.' });
  };

  const techLeaderboard = [...technicians].sort((a, b) => b.metrics.jobsCompleted - a.metrics.jobsCompleted);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm">Insights into your service operations</p>
        </div>
        <div className="flex gap-2">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-[110px] sm:w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 text-sm" onClick={exportCSV}>
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">CSV</span>
          </Button>
          <Button variant="outline" className="gap-2 text-sm" onClick={exportPDF}>
            <Printer className="w-4 h-4" /> <span className="hidden sm:inline">PDF</span>
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-chart-1" /> Tickets by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                <BarChart data={chartData.ticketsByStatus}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: 'var(--foreground)', opacity: 0.05, radius: 4 }}
                  />
                  <Bar dataKey="value" name="Tickets" radius={[6, 6, 0, 0]}>
                    {chartData.ticketsByStatus.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-chart-2" /> Resolution Time Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                <LineChart data={chartData.resolutionTime}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} unit="h" />
                  <Tooltip
                    content={<ChartTooltip valueFormatter={(v) => `${v}h`} />}
                    cursor={{ stroke: 'var(--foreground)', strokeOpacity: 0.1, strokeWidth: 1 }}
                  />
                  <Line type="monotone" dataKey="time" name="Resolution Time" stroke="var(--chart-2)" fillOpacity={1} fill="url(#colorTime)" strokeWidth={2} activeDot={{ r: 5, fill: 'var(--chart-2)', stroke: 'var(--popover)', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-chart-3" /> Service Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <div className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%" minHeight={1} minWidth={1}>
                <PieChart>
                  <Pie data={chartData.serviceDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {chartData.serviceDistribution.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<ChartTooltip indicator="dot" />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Technician Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {techLeaderboard.map((tech, i) => (
              <div key={tech.id} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${i === 0 ? 'bg-chart-3/20 text-chart-3' : i === 1 ? 'bg-chart-2/20 text-chart-2' : 'bg-muted text-muted-foreground'}`} style={{ fontWeight: 700 }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{tech.name}</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${(tech.metrics.jobsCompleted / 350) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm" style={{ fontWeight: 600 }}>{tech.metrics.jobsCompleted}</p>
                  <p className="text-[10px] text-muted-foreground">jobs</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}