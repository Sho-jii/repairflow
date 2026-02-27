import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './components/layout/root-layout';
import { LoginPage } from './pages/login';
import { SignupPage } from './pages/signup';
import { DashboardPage } from './pages/dashboard';
import { TicketsPage } from './pages/tickets';
import { TicketDetailPage } from './pages/ticket-detail';
import { TechniciansPage } from './pages/technicians';
import { CustomersPage, CustomerDetailPage } from './pages/customers';
import { ReportsPage } from './pages/reports';
import { NotificationsPage } from './pages/notifications-page';
import { SettingsPage } from './pages/settings';
import { AuditLogsPage } from './pages/audit-logs';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/signup',
    Component: SignupPage,
  },
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'tickets', Component: TicketsPage },
      { path: 'tickets/:id', Component: TicketDetailPage },
      { path: 'technicians', Component: TechniciansPage },
      { path: 'customers', Component: CustomersPage },
      { path: 'customers/:id', Component: CustomerDetailPage },
      { path: 'reports', Component: ReportsPage },
      { path: 'notifications', Component: NotificationsPage },
      { path: 'settings', Component: SettingsPage },
      { path: 'audit-logs', Component: AuditLogsPage },
      {
        path: '*',
        element: (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <p style={{ fontSize: '4rem', fontWeight: 800, opacity: 0.1 }}>404</p>
            <p className="text-sm">Page not found</p>
          </div>
        ),
      },
    ],
  },
]);