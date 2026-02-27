import type { User, Ticket, Technician, Customer, Notification, AuditLog } from './types';

export const AVATAR_URLS = {
  admin: 'https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
  manager: 'https://images.unsplash.com/photo-1706824250412-42b8ba877abb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
  tech1: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
  tech2: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
  tech3: 'https://images.unsplash.com/photo-1767339736277-980a7d7d1fe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
};

export const demoUsers: User[] = [
  { id: 'u1', name: 'Alex Rivera', email: 'admin@repairflow.io', role: 'admin', avatar: AVATAR_URLS.admin, phone: '+1 555-0101' },
  { id: 'u2', name: 'Sarah Chen', email: 'manager@repairflow.io', role: 'manager', avatar: AVATAR_URLS.manager, phone: '+1 555-0102' },
  { id: 'u3', name: 'Marcus Johnson', email: 'tech1@repairflow.io', role: 'technician', avatar: AVATAR_URLS.tech1, phone: '+1 555-0103' },
  { id: 'u4', name: 'Elena Vasquez', email: 'tech2@repairflow.io', role: 'technician', avatar: AVATAR_URLS.tech2, phone: '+1 555-0104' },
  { id: 'u5', name: 'James Park', email: 'tech3@repairflow.io', role: 'technician', avatar: AVATAR_URLS.tech3, phone: '+1 555-0105' },
];

export const technicians: Technician[] = [
  {
    id: 'u3', name: 'Marcus Johnson', email: 'tech1@repairflow.io', avatar: AVATAR_URLS.tech1, phone: '+1 555-0103',
    specialization: 'Electronics & Displays', status: 'busy', checkedIn: true, checkInTime: '2026-02-27T08:00:00Z',
    location: { lat: 40.7128, lng: -74.006, label: 'Manhattan, NY' },
    metrics: { jobsCompleted: 247, avgResolutionTime: 2.3, customerRating: 4.8, activeTickets: 3 },
  },
  {
    id: 'u4', name: 'Elena Vasquez', email: 'tech2@repairflow.io', avatar: AVATAR_URLS.tech2, phone: '+1 555-0104',
    specialization: 'HVAC Systems', status: 'available', checkedIn: true, checkInTime: '2026-02-27T07:45:00Z',
    location: { lat: 40.7282, lng: -73.7949, label: 'Queens, NY' },
    metrics: { jobsCompleted: 312, avgResolutionTime: 1.8, customerRating: 4.9, activeTickets: 1 },
  },
  {
    id: 'u5', name: 'James Park', email: 'tech3@repairflow.io', avatar: AVATAR_URLS.tech3, phone: '+1 555-0105',
    specialization: 'Plumbing & Water Systems', status: 'offline', checkedIn: false, checkOutTime: '2026-02-26T17:30:00Z',
    location: { lat: 40.6782, lng: -73.9442, label: 'Brooklyn, NY' },
    metrics: { jobsCompleted: 189, avgResolutionTime: 3.1, customerRating: 4.6, activeTickets: 0 },
  },
];

export const customers: Customer[] = [
  { id: 'c1', name: 'TechNova Inc.', email: 'contact@technova.com', phone: '+1 555-1001', company: 'TechNova Inc.', address: '47 Maple Ave, Cambridge, MA', totalTickets: 12, createdAt: '2025-06-15', feedback: [{ id: 'f1', ticketId: 'TK-1001', rating: 5, comment: 'Excellent service, very professional!', createdAt: '2026-02-20' }] },
  { id: 'c2', name: 'AeroSupply Co.', email: 'ops@aerosupply.com', phone: '+1 555-1002', company: 'AeroSupply Co.', address: '99 Ocean Rd, Brooklyn, NY', totalTickets: 8, createdAt: '2025-08-22', feedback: [{ id: 'f2', ticketId: 'TK-1003', rating: 4, comment: 'Good work, slightly delayed.', createdAt: '2026-02-18' }] },
  { id: 'c3', name: 'GreenLeaf Solutions', email: 'info@greenleaf.io', phone: '+1 555-1003', company: 'GreenLeaf Solutions', address: '22 Palm St, San Diego, CA', totalTickets: 5, createdAt: '2025-10-01', feedback: [] },
  { id: 'c4', name: 'Metro Dynamics', email: 'service@metrodynamics.com', phone: '+1 555-1004', company: 'Metro Dynamics', address: '91 2nd Ave, Portland, OR', totalTickets: 15, createdAt: '2025-03-10', feedback: [{ id: 'f3', ticketId: 'TK-1005', rating: 5, comment: 'Fast and reliable!', createdAt: '2026-02-25' }] },
  { id: 'c5', name: 'Pinnacle Systems', email: 'help@pinnacle.com', phone: '+1 555-1005', company: 'Pinnacle Systems', address: '21 King Rd, Ottawa, ON', totalTickets: 3, createdAt: '2026-01-05', feedback: [] },
  { id: 'c6', name: 'Quantum Labs', email: 'support@quantumlabs.io', phone: '+1 555-1006', company: 'Quantum Labs', address: '79 Lakeshore Blvd, Kelowna, BC', totalTickets: 7, createdAt: '2025-11-20', feedback: [{ id: 'f4', ticketId: 'TK-1008', rating: 3, comment: 'Could improve communication.', createdAt: '2026-01-30' }] },
];

export const tickets: Ticket[] = [
  {
    id: 'TK-1001', title: 'Server Room AC Malfunction', description: 'Main server room AC unit is not cooling properly. Temperature rising above threshold.', status: 'in_progress', priority: 'urgent',
    customerId: 'c1', customerName: 'TechNova Inc.', technicianId: 'u3', technicianName: 'Marcus Johnson',
    deviceType: 'HVAC Unit', serviceType: 'Emergency Repair', createdAt: '2026-02-27T06:00:00Z', updatedAt: '2026-02-27T08:30:00Z', assignedAt: '2026-02-27T06:15:00Z', slaDeadline: '2026-02-27T10:00:00Z',
    notes: [
      { id: 'n1', author: 'System', authorRole: 'admin', content: 'Ticket created', timestamp: '2026-02-27T06:00:00Z', type: 'system' },
      { id: 'n2', author: 'Sarah Chen', authorRole: 'manager', content: 'Assigned to Marcus Johnson - urgent priority', timestamp: '2026-02-27T06:15:00Z', type: 'assignment' },
      { id: 'n3', author: 'Marcus Johnson', authorRole: 'technician', content: 'On-site inspection started. Identified compressor issue.', timestamp: '2026-02-27T08:30:00Z', type: 'note' },
    ],
    attachments: [{ id: 'a1', name: 'ac_unit_photo.jpg', type: 'image/jpeg', size: '2.4 MB', url: '#', uploadedAt: '2026-02-27T08:35:00Z' }],
  },
  {
    id: 'TK-1002', title: 'Display Panel Replacement', description: 'Lobby display panel cracked and needs full replacement.', status: 'waiting_parts', priority: 'high',
    customerId: 'c2', customerName: 'AeroSupply Co.', technicianId: 'u3', technicianName: 'Marcus Johnson',
    deviceType: 'Digital Display', serviceType: 'Replacement', createdAt: '2026-02-25T10:00:00Z', updatedAt: '2026-02-26T14:00:00Z', assignedAt: '2026-02-25T10:30:00Z', slaDeadline: '2026-02-28T10:00:00Z',
    notes: [
      { id: 'n4', author: 'System', authorRole: 'admin', content: 'Ticket created', timestamp: '2026-02-25T10:00:00Z', type: 'system' },
      { id: 'n5', author: 'Marcus Johnson', authorRole: 'technician', content: 'Ordered replacement panel. ETA 2 days.', timestamp: '2026-02-26T14:00:00Z', type: 'note' },
    ],
    attachments: [],
  },
  {
    id: 'TK-1003', title: 'Plumbing Leak - Break Room', description: 'Water leak detected under the break room sink. Minor flooding.', status: 'completed', priority: 'high',
    customerId: 'c2', customerName: 'AeroSupply Co.', technicianId: 'u4', technicianName: 'Elena Vasquez',
    deviceType: 'Plumbing', serviceType: 'Repair', createdAt: '2026-02-24T09:00:00Z', updatedAt: '2026-02-24T15:00:00Z', assignedAt: '2026-02-24T09:20:00Z', completedAt: '2026-02-24T15:00:00Z', slaDeadline: '2026-02-25T09:00:00Z',
    notes: [
      { id: 'n6', author: 'System', authorRole: 'admin', content: 'Ticket created', timestamp: '2026-02-24T09:00:00Z', type: 'system' },
      { id: 'n7', author: 'Elena Vasquez', authorRole: 'technician', content: 'Pipe repaired, leak stopped. Tested for 1 hour - no recurrence.', timestamp: '2026-02-24T15:00:00Z', type: 'note' },
    ],
    attachments: [],
  },
  {
    id: 'TK-1004', title: 'Security Camera System Offline', description: 'Multiple security cameras in parking garage are offline.', status: 'assigned', priority: 'urgent',
    customerId: 'c3', customerName: 'GreenLeaf Solutions', technicianId: 'u4', technicianName: 'Elena Vasquez',
    deviceType: 'Security System', serviceType: 'Diagnostics', createdAt: '2026-02-27T07:00:00Z', updatedAt: '2026-02-27T07:30:00Z', assignedAt: '2026-02-27T07:30:00Z', slaDeadline: '2026-02-27T11:00:00Z',
    notes: [
      { id: 'n8', author: 'System', authorRole: 'admin', content: 'Ticket created', timestamp: '2026-02-27T07:00:00Z', type: 'system' },
    ],
    attachments: [],
  },
  {
    id: 'TK-1005', title: 'Elevator Maintenance Check', description: 'Scheduled quarterly maintenance for passenger elevators A and B.', status: 'pending', priority: 'medium',
    customerId: 'c4', customerName: 'Metro Dynamics',
    deviceType: 'Elevator', serviceType: 'Scheduled Maintenance', createdAt: '2026-02-26T16:00:00Z', updatedAt: '2026-02-26T16:00:00Z', slaDeadline: '2026-03-05T16:00:00Z',
    notes: [{ id: 'n9', author: 'System', authorRole: 'admin', content: 'Ticket created', timestamp: '2026-02-26T16:00:00Z', type: 'system' }],
    attachments: [],
  },
  {
    id: 'TK-1006', title: 'Generator Fault - Building B', description: 'Backup generator not starting during power test.', status: 'in_progress', priority: 'high',
    customerId: 'c4', customerName: 'Metro Dynamics', technicianId: 'u3', technicianName: 'Marcus Johnson',
    deviceType: 'Generator', serviceType: 'Repair', createdAt: '2026-02-26T08:00:00Z', updatedAt: '2026-02-27T09:00:00Z', assignedAt: '2026-02-26T08:30:00Z', slaDeadline: '2026-02-28T08:00:00Z',
    notes: [],
    attachments: [],
  },
  {
    id: 'TK-1007', title: 'Fire Alarm Sensor Replacement', description: 'Replace 4 faulty smoke detectors on Floor 3.', status: 'closed', priority: 'medium',
    customerId: 'c5', customerName: 'Pinnacle Systems', technicianId: 'u4', technicianName: 'Elena Vasquez',
    deviceType: 'Fire Safety', serviceType: 'Replacement', createdAt: '2026-02-20T10:00:00Z', updatedAt: '2026-02-22T16:00:00Z', assignedAt: '2026-02-20T11:00:00Z', completedAt: '2026-02-22T14:00:00Z', closedAt: '2026-02-22T16:00:00Z', slaDeadline: '2026-02-23T10:00:00Z',
    notes: [],
    attachments: [],
  },
  {
    id: 'TK-1008', title: 'Network Switch Configuration', description: 'Configure new network switch for expanded office wing.', status: 'pending', priority: 'low',
    customerId: 'c6', customerName: 'Quantum Labs',
    deviceType: 'Network Equipment', serviceType: 'Installation', createdAt: '2026-02-27T05:00:00Z', updatedAt: '2026-02-27T05:00:00Z', slaDeadline: '2026-03-06T05:00:00Z',
    notes: [],
    attachments: [],
  },
  {
    id: 'TK-1009', title: 'HVAC Filter Replacement - All Floors', description: 'Replace HVAC filters across all 5 floors as part of quarterly schedule.', status: 'pending', priority: 'low',
    customerId: 'c1', customerName: 'TechNova Inc.',
    deviceType: 'HVAC Unit', serviceType: 'Scheduled Maintenance', createdAt: '2026-02-27T04:00:00Z', updatedAt: '2026-02-27T04:00:00Z', slaDeadline: '2026-03-10T04:00:00Z',
    notes: [],
    attachments: [],
  },
  {
    id: 'TK-1010', title: 'Parking Gate Motor Failure', description: 'Main parking gate motor jammed. Manual override in use.', status: 'assigned', priority: 'high',
    customerId: 'c3', customerName: 'GreenLeaf Solutions', technicianId: 'u5', technicianName: 'James Park',
    deviceType: 'Mechanical Gate', serviceType: 'Repair', createdAt: '2026-02-26T14:00:00Z', updatedAt: '2026-02-26T14:30:00Z', assignedAt: '2026-02-26T14:30:00Z', slaDeadline: '2026-02-27T14:00:00Z',
    notes: [],
    attachments: [],
  },
];

export const notifications: Notification[] = [
  { id: 'nt1', title: 'New Assignment', message: 'TK-1001 assigned to Marcus Johnson for urgent AC repair at TechNova Inc.', type: 'assignment', read: false, createdAt: '2026-02-27T06:15:00Z', link: '/tickets/TK-1001' },
  { id: 'nt2', title: 'SLA Warning', message: 'TK-1004 approaching SLA deadline — only 3 hours remaining. Immediate action required.', type: 'sla_breach', read: false, createdAt: '2026-02-27T05:00:00Z', link: '/tickets/TK-1004' },
  { id: 'nt3', title: 'Status Updated', message: 'TK-1002 moved to "Waiting for Parts" — replacement display panel ordered by Marcus Johnson.', type: 'status_update', read: false, createdAt: '2026-02-26T14:00:00Z', link: '/tickets/TK-1002' },
  { id: 'nt4', title: 'Overdue Task', message: 'TK-1010 (Parking Gate Motor Failure) is now overdue by 2 hours. Customer escalation pending.', type: 'overdue', read: true, createdAt: '2026-02-27T04:00:00Z', link: '/tickets/TK-1010' },
  { id: 'nt5', title: 'Ticket Completed', message: 'TK-1003 has been completed by Elena Vasquez — plumbing leak at AeroSupply fixed successfully.', type: 'status_update', read: true, createdAt: '2026-02-24T15:00:00Z', link: '/tickets/TK-1003' },
  { id: 'nt6', title: 'System Backup Complete', message: 'Daily backup completed successfully at 03:00 AM. All data snapshots verified. Next backup scheduled in 24h.', type: 'system', read: true, createdAt: '2026-02-27T03:00:00Z' },
  { id: 'nt7', title: 'New Assignment', message: 'TK-1004 assigned to Elena Vasquez — security camera system offline at GreenLeaf Solutions.', type: 'assignment', read: false, createdAt: '2026-02-27T04:30:00Z', link: '/tickets/TK-1004' },
  { id: 'nt8', title: 'Technician Check-In', message: 'Marcus Johnson checked in at 08:00 AM from Manhattan, NY. Current active tickets: 3.', type: 'system', read: true, createdAt: '2026-02-26T08:00:00Z' },
  { id: 'nt9', title: 'SLA Breach Alert', message: 'TK-1010 has breached its SLA deadline. Parking gate repair was due 2 hours ago. Please escalate.', type: 'sla_breach', read: false, createdAt: '2026-02-27T02:30:00Z', link: '/tickets/TK-1010' },
  { id: 'nt10', title: 'New Ticket Created', message: 'TK-1009 "HVAC Filter Replacement - All Floors" submitted by TechNova Inc. Priority: Low.', type: 'status_update', read: true, createdAt: '2026-02-27T01:00:00Z', link: '/tickets/TK-1009' },
  { id: 'nt11', title: 'Technician Check-Out', message: 'James Park checked out at 5:30 PM after completing 4 service calls today in Brooklyn, NY.', type: 'system', read: true, createdAt: '2026-02-25T17:30:00Z' },
  { id: 'nt12', title: 'Customer Feedback Received', message: 'TechNova Inc. rated TK-1001 service 5/5 stars — "Excellent service, very professional!"', type: 'status_update', read: true, createdAt: '2026-02-25T20:00:00Z', link: '/customers/c1' },
  { id: 'nt13', title: 'Parts Shipment Update', message: 'Replacement display panel for TK-1002 shipped. Expected delivery: Feb 28, 2026.', type: 'system', read: false, createdAt: '2026-02-25T18:00:00Z', link: '/tickets/TK-1002' },
  { id: 'nt14', title: 'Overdue Reminder', message: 'TK-1005 (Elevator Maintenance) has not been assigned yet. Ticket was created 11 hours ago.', type: 'overdue', read: false, createdAt: '2026-02-26T03:00:00Z', link: '/tickets/TK-1005' },
  { id: 'nt15', title: 'Assignment Completed', message: 'Elena Vasquez completed TK-1007 — fire alarm sensor replacement at Pinnacle Systems. All 4 sensors replaced.', type: 'assignment', read: true, createdAt: '2026-02-22T14:00:00Z', link: '/tickets/TK-1007' },
  { id: 'nt16', title: 'Ticket Reopened', message: 'TK-1003 has been reopened by AeroSupply Co. — customer reports recurring leak in the same area.', type: 'status_update', read: false, createdAt: '2026-02-26T10:00:00Z', link: '/tickets/TK-1003' },
  { id: 'nt17', title: 'Scheduled Maintenance Due', message: 'Quarterly HVAC maintenance for TechNova Inc. is due in 3 days. Ticket TK-1009 pending assignment.', type: 'system', read: true, createdAt: '2026-02-26T09:00:00Z', link: '/tickets/TK-1009' },
  { id: 'nt18', title: 'High Priority Escalation', message: 'TK-1006 (Generator Fault) escalated to high priority by Metro Dynamics. Building B has no backup power.', type: 'sla_breach', read: false, createdAt: '2026-02-26T11:00:00Z', link: '/tickets/TK-1006' },
  { id: 'nt19', title: 'New Assignment', message: 'TK-1010 assigned to James Park — parking gate motor failure at GreenLeaf Solutions needs immediate attention.', type: 'assignment', read: true, createdAt: '2026-02-25T14:30:00Z', link: '/tickets/TK-1010' },
  { id: 'nt20', title: 'System Update', message: 'RepairFlow v2.4.1 deployed. New features: improved SLA tracking, mobile check-in, and CSV export.', type: 'system', read: true, createdAt: '2026-02-24T02:00:00Z' },
  { id: 'nt21', title: 'Low Customer Rating', message: 'Quantum Labs rated TK-1008 service 3/5 stars — "Could improve communication." Review recommended.', type: 'overdue', read: true, createdAt: '2026-02-25T10:00:00Z', link: '/customers/c6' },
  { id: 'nt22', title: 'Technician Availability', message: 'Elena Vasquez is now available. Current workload: 1 active ticket. Specialization: HVAC Systems.', type: 'system', read: true, createdAt: '2026-02-26T09:30:00Z' },
];

export const auditLogs: AuditLog[] = [
  { id: 'al1', action: 'User Login', user: 'Alex Rivera', userRole: 'admin', details: 'Logged in from 192.168.1.100', timestamp: '2026-02-27T07:00:00Z', category: 'auth' },
  { id: 'al2', action: 'Ticket Created', user: 'Sarah Chen', userRole: 'manager', details: 'Created TK-1001 - Server Room AC Malfunction', timestamp: '2026-02-27T06:00:00Z', category: 'ticket' },
  { id: 'al3', action: 'Technician Assigned', user: 'Sarah Chen', userRole: 'manager', details: 'Assigned Marcus Johnson to TK-1001', timestamp: '2026-02-27T06:15:00Z', category: 'assignment' },
  { id: 'al4', action: 'Status Changed', user: 'Marcus Johnson', userRole: 'technician', details: 'TK-1001 status changed: assigned -> in_progress', timestamp: '2026-02-27T08:30:00Z', category: 'status' },
  { id: 'al5', action: 'Ticket Created', user: 'Alex Rivera', userRole: 'admin', details: 'Created TK-1004 - Security Camera System Offline', timestamp: '2026-02-27T07:00:00Z', category: 'ticket' },
  { id: 'al6', action: 'User Login', user: 'Marcus Johnson', userRole: 'technician', details: 'Logged in from mobile device', timestamp: '2026-02-27T07:55:00Z', category: 'auth' },
  { id: 'al7', action: 'Check-In', user: 'Marcus Johnson', userRole: 'technician', details: 'Checked in at Manhattan, NY', timestamp: '2026-02-27T08:00:00Z', category: 'system' },
  { id: 'al8', action: 'Ticket Completed', user: 'Elena Vasquez', userRole: 'technician', details: 'Completed TK-1003 - Plumbing Leak', timestamp: '2026-02-24T15:00:00Z', category: 'status' },
  { id: 'al9', action: 'Settings Updated', user: 'Alex Rivera', userRole: 'admin', details: 'Updated SLA thresholds', timestamp: '2026-02-26T10:00:00Z', category: 'system' },
  { id: 'al10', action: 'User Login', user: 'Sarah Chen', userRole: 'manager', details: 'Logged in from 192.168.1.105', timestamp: '2026-02-27T06:00:00Z', category: 'auth' },
];

export const chartData = {
  ticketsByStatus: [
    { name: 'Pending', value: 3, fill: 'var(--chart-4)' },
    { name: 'Assigned', value: 2, fill: 'var(--chart-1)' },
    { name: 'In Progress', value: 2, fill: 'var(--chart-2)' },
    { name: 'Waiting Parts', value: 1, fill: 'var(--chart-5)' },
    { name: 'Completed', value: 1, fill: 'var(--chart-3)' },
    { name: 'Closed', value: 1, fill: 'var(--chart-4)' },
  ],
  resolutionTrend: [
    { date: 'Mon', time: 2.1 },
    { date: 'Tue', time: 3.4 },
    { date: 'Wed', time: 1.8 },
    { date: 'Thu', time: 2.7 },
    { date: 'Fri', time: 2.2 },
    { date: 'Sat', time: 1.5 },
    { date: 'Sun', time: 2.0 },
  ],
  weeklyActivity: [
    { day: 'Mon', created: 5, completed: 3 },
    { day: 'Tue', created: 8, completed: 6 },
    { day: 'Wed', created: 4, completed: 7 },
    { day: 'Thu', created: 6, completed: 5 },
    { day: 'Fri', created: 9, completed: 8 },
    { day: 'Sat', created: 2, completed: 3 },
    { day: 'Sun', created: 1, completed: 1 },
  ],
  serviceDistribution: [
    { name: 'Emergency Repair', value: 25 },
    { name: 'Scheduled Maintenance', value: 35 },
    { name: 'Installation', value: 15 },
    { name: 'Diagnostics', value: 10 },
    { name: 'Replacement', value: 15 },
  ],
};