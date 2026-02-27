import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { Search, Star, Mail, Phone, MapPin, Building, ArrowLeft, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { customers } from '../lib/mock-data';
import { useTicketStore } from '../lib/store';
import { StatusBadge } from './dashboard';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function CustomersPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Customers</h1>
          <p className="text-muted-foreground text-sm">{customers.length} customers</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-input-background" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {filtered.map((customer, i) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group"
              onClick={() => navigate(`/customers/${customer.id}`)}
            >
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Avatar className="h-9 w-9 sm:h-11 sm:w-11">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm sm:text-base">{customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontWeight: 600 }} className="text-sm truncate">{customer.name}</p>
                    {customer.company && <p className="text-[11px] sm:text-xs text-muted-foreground truncate">{customer.company}</p>}
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{customer.totalTickets} tickets</Badge>
                </div>
                <Separator className="my-2 sm:my-3" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
                    <Mail className="w-3 h-3 shrink-0" /> <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground">
                    <Phone className="w-3 h-3 shrink-0" /> {customer.phone}
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{customer.address}</span>
                  </div>
                </div>
                {customer.feedback.length > 0 && (
                  <div className="flex items-center gap-1 mt-3 text-xs">
                    <Star className="w-3 h-3 text-chart-3 fill-chart-3" />
                    <span>{(customer.feedback.reduce((a, f) => a + f.rating, 0) / customer.feedback.length).toFixed(1)}</span>
                    <span className="text-muted-foreground">({customer.feedback.length} reviews)</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Building className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No customers found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets } = useTicketStore();
  const customer = customers.find(c => c.id === id);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <p>Customer not found</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate('/customers')}>Back</Button>
      </div>
    );
  }

  const customerTickets = tickets.filter(t => t.customerId === customer.id);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{customer.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-5 space-y-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">{customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p style={{ fontWeight: 600 }}>{customer.name}</p>
              {customer.company && <p className="text-sm text-muted-foreground">{customer.company}</p>}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-muted-foreground" /> {customer.email}</div>
              <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /> {customer.phone}</div>
              <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-muted-foreground" /> {customer.address}</div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 rounded-lg bg-muted/50 text-center">
                <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{customer.totalTickets}</p>
                <p className="text-[10px] text-muted-foreground">Total Tickets</p>
              </div>
              <div className="p-2 rounded-lg bg-muted/50 text-center">
                <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  {customer.feedback.length > 0
                    ? (customer.feedback.reduce((a, f) => a + f.rating, 0) / customer.feedback.length).toFixed(1)
                    : '—'}
                </p>
                <p className="text-[10px] text-muted-foreground">Avg Rating</p>
              </div>
            </div>
            <Button className="w-full gap-2" onClick={() => setFeedbackOpen(true)}>
              <MessageSquare className="w-4 h-4" /> Submit Feedback
            </Button>
          </CardContent>
        </Card>

        {/* Tickets & Feedback */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Service History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {customerTickets.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No tickets yet</p>}
              {customerTickets.map(t => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/30 cursor-pointer transition-colors" onClick={() => navigate(`/tickets/${t.id}`)}>
                  <span className="text-xs text-muted-foreground w-20">{t.id}</span>
                  <span className="text-sm flex-1 truncate">{t.title}</span>
                  <StatusBadge status={t.status} />
                  <span className="text-xs text-muted-foreground hidden sm:inline">{format(new Date(t.createdAt), 'MMM d')}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {customer.feedback.length > 0 && (
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {customer.feedback.map(f => (
                  <div key={f.id} className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= f.rating ? 'text-chart-3 fill-chart-3' : 'text-muted'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">Ticket {f.ticketId}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{format(new Date(f.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{f.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Rating</Label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setFeedbackRating(s)} className="p-1">
                    <Star className={`w-6 h-6 transition-colors ${s <= feedbackRating ? 'text-chart-3 fill-chart-3' : 'text-muted'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Comment</Label>
              <Textarea value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Share your experience..." className="bg-input-background mt-1" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackOpen(false)}>Cancel</Button>
            <Button onClick={() => { setFeedbackOpen(false); toast.success('Feedback submitted (demo)'); setFeedbackText(''); }}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}