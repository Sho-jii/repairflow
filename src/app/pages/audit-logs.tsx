import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Shield, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { auditLogs } from '../lib/mock-data';
import { format } from 'date-fns';

const categoryColors: Record<string, string> = {
  auth: 'bg-blue-500/10 text-blue-500',
  ticket: 'bg-purple-500/10 text-purple-500',
  assignment: 'bg-cyan-500/10 text-cyan-500',
  status: 'bg-yellow-500/10 text-yellow-500',
  system: 'bg-gray-500/10 text-gray-500',
};

export function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let result = [...auditLogs];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(l => l.action.toLowerCase().includes(s) || l.user.toLowerCase().includes(s) || l.details.toLowerCase().includes(s));
    }
    if (categoryFilter !== 'all') result = result.filter(l => l.category === categoryFilter);
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [search, categoryFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }} className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" /> Audit Logs
        </h1>
        <p className="text-muted-foreground text-sm">{filtered.length} log entries</p>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-input-background" />
            </div>
            <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="ticket">Ticket</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-2">
        {paginated.map(log => (
          <Card key={log.id} className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${categoryColors[log.category] || ''}`}>
                  {log.category}
                </span>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-sm">{log.action}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-muted-foreground">{log.user}</span>
                <Badge variant="secondary" className="text-[10px] capitalize">{log.userRole}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{log.details}</p>
            </CardContent>
          </Card>
        ))}
        {paginated.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No log entries found</div>
        )}
      </div>

      {/* Mobile Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between md:hidden">
          <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden lg:table-cell">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                  </TableCell>
                  <TableCell className="text-sm">{log.action}</TableCell>
                  <TableCell className="text-sm">{log.user}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className="text-[10px] capitalize">{log.userRole}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] ${categoryColors[log.category] || ''}`}>
                      {log.category}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[300px] truncate">{log.details}</TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No log entries found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 sm:p-4 border-t border-border">
            <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}