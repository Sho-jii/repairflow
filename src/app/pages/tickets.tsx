import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Skeleton } from '../components/ui/skeleton';
import { useTicketStore, useTechnicianStore } from '../lib/store';
import { StatusBadge, PriorityBadge } from './dashboard';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { customers } from '../lib/mock-data';
import type { TicketPriority, TicketStatus } from '../lib/types';

export function TicketsPage() {
  const { tickets, addTicket, assignTechnician } = useTicketStore();
  const { technicians } = useTechnicianStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [createOpen, setCreateOpen] = useState(searchParams.get('create') === 'true');
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTicketId, setAssignTicketId] = useState('');

  // Create form state
  const [newTicket, setNewTicket] = useState({
    title: '', description: '', customerId: '', deviceType: '', serviceType: '', priority: 'medium' as TicketPriority,
  });

  const filtered = useMemo(() => {
    let result = [...tickets];
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(s) || t.id.toLowerCase().includes(s) || t.customerName.toLowerCase().includes(s));
    }
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') result = result.filter(t => t.priority === priorityFilter);
    if (sortBy === 'date') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else result.sort((a, b) => { const p = { urgent: 4, high: 3, medium: 2, low: 1 }; return (p[b.priority] || 0) - (p[a.priority] || 0); });
    return result;
  }, [tickets, search, statusFilter, priorityFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleCreate = () => {
    const customer = customers.find(c => c.id === newTicket.customerId);
    const id = `TK-${1000 + tickets.length + 1}`;
    const now = new Date().toISOString();
    const slaHours = { low: 168, medium: 48, high: 24, urgent: 4 };
    const sla = new Date(Date.now() + slaHours[newTicket.priority] * 3600000).toISOString();

    addTicket({
      id, title: newTicket.title, description: newTicket.description, status: 'pending',
      priority: newTicket.priority, customerId: newTicket.customerId,
      customerName: customer?.name || 'Unknown', deviceType: newTicket.deviceType,
      serviceType: newTicket.serviceType, createdAt: now, updatedAt: now, slaDeadline: sla,
      notes: [{ id: `n-${Date.now()}`, author: 'System', authorRole: 'admin', content: 'Ticket created', timestamp: now, type: 'system' }],
      attachments: [],
    });
    setCreateOpen(false);
    setNewTicket({ title: '', description: '', customerId: '', deviceType: '', serviceType: '', priority: 'medium' });
    toast.success('Ticket created successfully', { description: `${id} has been added to the queue.` });
  };

  const handleAssign = (techId: string) => {
    const tech = technicians.find(t => t.id === techId);
    if (tech) {
      assignTechnician(assignTicketId, techId, tech.name);
      setAssignOpen(false);
      toast.success('Technician assigned', { description: `${tech.name} assigned to ${assignTicketId}` });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tickets</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} total tickets</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> New Ticket
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 bg-input-background"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="waiting_parts">Waiting Parts</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={v => { setPriorityFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="shrink-0" onClick={() => setSortBy(sortBy === 'date' ? 'priority' : 'date')}>
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-2">
        {paginated.map(ticket => (
          <Card
            key={ticket.id}
            className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate(`/tickets/${ticket.id}`)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{ticket.id}</span>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <StatusBadge status={ticket.status} />
              </div>
              <p className="text-sm truncate">{ticket.title}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground truncate">{ticket.customerName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{format(new Date(ticket.createdAt), 'MMM d')}</span>
                  {!ticket.technicianId && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[10px] h-6 px-2"
                      onClick={(e) => { e.stopPropagation(); setAssignTicketId(ticket.id); setAssignOpen(true); }}
                    >
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {paginated.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No tickets found matching your filters
          </div>
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
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead className="hidden lg:table-cell">Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(ticket => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer hover:bg-accent/30"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <TableCell className="text-muted-foreground text-xs">{ticket.id}</TableCell>
                  <TableCell>
                    <span className="text-sm">{ticket.title}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{ticket.customerName}</TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{ticket.technicianName || '—'}</TableCell>
                  <TableCell><StatusBadge status={ticket.status} /></TableCell>
                  <TableCell><PriorityBadge priority={ticket.priority} /></TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {format(new Date(ticket.createdAt), 'MMM d')}
                  </TableCell>
                  <TableCell>
                    {!ticket.technicianId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={(e) => { e.stopPropagation(); setAssignTicketId(ticket.id); setAssignOpen(true); }}
                      >
                        Assign
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No tickets found matching your filters
                  </TableCell>
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

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
            <DialogDescription>Fill in the details to create a new service ticket.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newTicket.title} onChange={e => setNewTicket(p => ({ ...p, title: e.target.value }))} placeholder="Brief description" className="bg-input-background" />
            </div>
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select value={newTicket.customerId} onValueChange={v => setNewTicket(p => ({ ...p, customerId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Device Type</Label>
                <Input value={newTicket.deviceType} onChange={e => setNewTicket(p => ({ ...p, deviceType: e.target.value }))} placeholder="e.g., HVAC Unit" className="bg-input-background" />
              </div>
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Input value={newTicket.serviceType} onChange={e => setNewTicket(p => ({ ...p, serviceType: e.target.value }))} placeholder="e.g., Repair" className="bg-input-background" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={newTicket.priority} onValueChange={v => setNewTicket(p => ({ ...p, priority: v as TicketPriority }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={newTicket.description} onChange={e => setNewTicket(p => ({ ...p, description: e.target.value }))} placeholder="Describe the issue..." className="bg-input-background" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newTicket.title || !newTicket.customerId}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>Select a technician for {assignTicketId}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {technicians.map(tech => (
              <button
                key={tech.id}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                onClick={() => handleAssign(tech.id)}
              >
                <div className={`w-2 h-2 rounded-full ${tech.status === 'available' ? 'bg-green-500' : tech.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'}`} />
                <div className="flex-1">
                  <p className="text-sm">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.specialization} · {tech.metrics.activeTickets} active</p>
                </div>
                <Badge variant="secondary" className="text-[10px] capitalize">{tech.status}</Badge>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}