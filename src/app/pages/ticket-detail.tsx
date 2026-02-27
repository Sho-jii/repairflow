import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, User, Paperclip, MessageSquare, ChevronRight, Upload, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { useTicketStore } from '../lib/store';
import { StatusBadge, PriorityBadge } from './dashboard';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import type { TicketStatus } from '../lib/types';

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets, updateTicketStatus } = useTicketStore();
  const ticket = tickets.find(t => t.id === id);
  const [note, setNote] = useState('');
  const [previewFiles, setPreviewFiles] = useState<{ name: string; url: string }[]>([]);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
        <p>Ticket not found</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate('/tickets')}>Back to tickets</Button>
      </div>
    );
  }

  const slaRemaining = new Date(ticket.slaDeadline).getTime() - Date.now();
  const slaHours = Math.max(0, Math.floor(slaRemaining / 3600000));
  const slaMinutes = Math.max(0, Math.floor((slaRemaining % 3600000) / 60000));
  const slaExpired = slaRemaining <= 0;

  const handleStatusChange = (status: string) => {
    updateTicketStatus(ticket.id, status as TicketStatus);
    toast.success('Status updated', { description: `${ticket.id} is now ${status.replace('_', ' ')}` });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewFiles(prev => [...prev, { name: file.name, url }]);
    });
    toast.success('File uploaded (demo)', { description: 'Files stored in memory only.' });
  };

  const noteColors: Record<string, string> = {
    system: 'border-l-gray-500',
    assignment: 'border-l-blue-500',
    status_change: 'border-l-yellow-500',
    note: 'border-l-primary',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => navigate('/tickets')}>
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-foreground text-xs sm:text-sm">{ticket.id}</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground hidden sm:block" />
            <h1 className="truncate" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontWeight: 700 }}>{ticket.title}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Details Card */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{ticket.description}</p>
              <Separator />
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Device</p>
                  <p className="text-sm mt-0.5">{ticket.deviceType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Service</p>
                  <p className="text-sm mt-0.5">{ticket.serviceType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm mt-0.5">{ticket.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Technician</p>
                  <p className="text-sm mt-0.5">{ticket.technicianName || 'Unassigned'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {ticket.notes.map(n => (
                  <div key={n.id} className={`border-l-2 pl-3 sm:pl-4 py-1 ${noteColors[n.type] || 'border-l-border'}`}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                        <AvatarFallback className="text-[10px]">{n.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{n.author}</span>
                      <Badge variant="secondary" className="text-[10px] capitalize">{n.type.replace('_', ' ')}</Badge>
                      <span className="text-[10px] sm:text-xs text-muted-foreground sm:ml-auto">
                        {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 ml-7 sm:ml-8">{n.content}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <Textarea
                  placeholder="Add a note..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="bg-input-background"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    disabled={!note.trim()}
                    onClick={() => { toast.success('Note added (demo)'); setNote(''); }}
                  >
                    Add Note
                  </Button>
                  <label>
                    <Button variant="outline" size="sm" className="gap-1 cursor-pointer" asChild>
                      <span><Upload className="w-3 h-3" /> Attach File</span>
                    </Button>
                    <input type="file" className="hidden" onChange={handleFileUpload} multiple accept="image/*,.pdf,.doc,.docx" />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {(ticket.attachments.length > 0 || previewFiles.length > 0) && (
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Paperclip className="w-4 h-4" /> Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ticket.attachments.map(a => (
                    <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
                      <Image className="w-8 h-8 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate">{a.name}</p>
                        <p className="text-[10px] text-muted-foreground">{a.size}</p>
                      </div>
                    </div>
                  ))}
                  {previewFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
                      <img src={f.url} alt="" className="w-8 h-8 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate">{f.name}</p>
                        <p className="text-[10px] text-muted-foreground">Uploaded</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Card */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <Select value={ticket.status} onValueChange={handleStatusChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="waiting_parts">Waiting for Parts</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Priority</p>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">SLA Deadline</p>
                <div className={`flex items-center gap-2 p-2 rounded-lg ${slaExpired ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {slaExpired ? 'Expired' : `${slaHours}h ${slaMinutes}m remaining`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 space-y-3">
              <p className="text-xs text-muted-foreground">Timestamps</p>
              {[
                { label: 'Created', value: ticket.createdAt },
                { label: 'Updated', value: ticket.updatedAt },
                { label: 'Assigned', value: ticket.assignedAt },
                { label: 'Completed', value: ticket.completedAt },
                { label: 'Closed', value: ticket.closedAt },
              ].map(ts => ts.value && (
                <div key={ts.label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{ts.label}</span>
                  <span>{format(new Date(ts.value), 'MMM d, h:mm a')}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}