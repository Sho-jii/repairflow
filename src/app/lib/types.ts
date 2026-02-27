export type Role = 'admin' | 'manager' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  phone?: string;
}

export type TicketStatus = 'pending' | 'assigned' | 'in_progress' | 'waiting_parts' | 'completed' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerId: string;
  customerName: string;
  technicianId?: string;
  technicianName?: string;
  deviceType: string;
  serviceType: string;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string;
  completedAt?: string;
  closedAt?: string;
  slaDeadline: string;
  notes: TicketNote[];
  attachments: Attachment[];
}

export interface TicketNote {
  id: string;
  author: string;
  authorRole: Role;
  content: string;
  timestamp: string;
  type: 'note' | 'status_change' | 'assignment' | 'system';
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  uploadedAt: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  specialization: string;
  status: 'available' | 'busy' | 'offline' | 'on_break';
  checkedIn: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  location?: { lat: number; lng: number; label: string };
  metrics: {
    jobsCompleted: number;
    avgResolutionTime: number;
    customerRating: number;
    activeTickets: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  totalTickets: number;
  createdAt: string;
  feedback: CustomerFeedback[];
}

export interface CustomerFeedback {
  id: string;
  ticketId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'status_update' | 'overdue' | 'sla_breach' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  userRole: Role;
  details: string;
  timestamp: string;
  category: 'auth' | 'ticket' | 'assignment' | 'status' | 'system';
}

export interface SLASettings {
  lowPriority: number;
  mediumPriority: number;
  highPriority: number;
  urgentPriority: number;
}
