import { create } from 'zustand';
import type { User, Notification, Ticket, Technician } from './types';
import { demoUsers, notifications as mockNotifications, tickets as mockTickets, technicians as mockTechnicians } from './mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem('repairflow_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  })(),
  isAuthenticated: !!localStorage.getItem('repairflow_user'),
  login: async (email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const user = demoUsers.find(u => u.email === email);
    if (!user) return { success: false, error: 'Invalid email or password' };
    localStorage.setItem('repairflow_user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
    return { success: true };
  },
  logout: () => {
    localStorage.removeItem('repairflow_user');
    set({ user: null, isAuthenticated: false });
  },
}));

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (n: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.read).length,
  markAsRead: (id) => {
    const updated = get().notifications.map(n => n.id === id ? { ...n, read: true } : n);
    set({ notifications: updated, unreadCount: updated.filter(n => !n.read).length });
  },
  markAllAsRead: () => {
    const updated = get().notifications.map(n => ({ ...n, read: true }));
    set({ notifications: updated, unreadCount: 0 });
  },
  addNotification: (n) => {
    set(state => ({
      notifications: [n, ...state.notifications],
      unreadCount: state.unreadCount + (n.read ? 0 : 1),
    }));
  },
}));

interface TicketState {
  tickets: Ticket[];
  updateTicketStatus: (id: string, status: Ticket['status']) => void;
  addTicket: (ticket: Ticket) => void;
  assignTechnician: (ticketId: string, techId: string, techName: string) => void;
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: mockTickets,
  updateTicketStatus: (id, status) => {
    const now = new Date().toISOString();
    set({
      tickets: get().tickets.map(t =>
        t.id === id ? { ...t, status, updatedAt: now, ...(status === 'completed' ? { completedAt: now } : {}), ...(status === 'closed' ? { closedAt: now } : {}) } : t
      ),
    });
  },
  addTicket: (ticket) => set(state => ({ tickets: [ticket, ...state.tickets] })),
  assignTechnician: (ticketId, techId, techName) => {
    const now = new Date().toISOString();
    set({
      tickets: get().tickets.map(t =>
        t.id === ticketId ? { ...t, technicianId: techId, technicianName: techName, status: 'assigned' as const, assignedAt: now, updatedAt: now } : t
      ),
    });
  },
}));

interface TechnicianState {
  technicians: Technician[];
  toggleCheckIn: (id: string) => void;
}

export const useTechnicianStore = create<TechnicianState>((set, get) => ({
  technicians: mockTechnicians,
  toggleCheckIn: (id) => {
    const now = new Date().toISOString();
    set({
      technicians: get().technicians.map(t =>
        t.id === id ? {
          ...t,
          checkedIn: !t.checkedIn,
          status: t.checkedIn ? 'offline' as const : 'available' as const,
          ...(t.checkedIn ? { checkOutTime: now } : { checkInTime: now }),
        } : t
      ),
    });
  },
}));
