import type { RouteObject } from 'react-router'
import { ProfilePage } from '@pages/profile'
import { MyTicketsPage } from '@pages/my-tickets'
import { TicketDetailPage } from '@pages/ticket-detail'

// Organizer
import { OrganizerDashboardPage } from '@pages/organizer-dashboard'
import { MyEventsPage } from '@pages/my-events'
import { CreateEventPage } from '@pages/create-event'
import { EditEventPage } from '@pages/edit-event'
import { EventParticipantsPage } from '@pages/event-participants'
import { EventVolunteersPage } from '@pages/event-volunteers'
import { EventServicesPage } from '@pages/event-services'

// Vendor
import { MyVenuesPage } from '@pages/my-venues'
import { CreateVenuePage } from '@pages/create-venue'
import { EditVenuePage } from '@pages/edit-venue'
import { MyServicesPage } from '@pages/my-services'
import { CreateServicePage } from '@pages/create-service'
import { EditServicePage } from '@pages/edit-service'

// Admin
import { AdminUsersPage } from '@pages/admin-users'
import { AdminDashboardPage } from '@pages/admin-dashboard'

export const privateRoutes: RouteObject[] = [
  // Common
  { path: '/profile', element: <ProfilePage /> },
  { path: '/tickets', element: <MyTicketsPage /> },
  { path: '/tickets/:id', element: <TicketDetailPage /> },

  // Organizer
  { path: '/dashboard', element: <OrganizerDashboardPage /> },
  { path: '/my-events', element: <MyEventsPage /> },
  { path: '/my-events/create', element: <CreateEventPage /> },
  { path: '/my-events/:id/edit', element: <EditEventPage /> },
  { path: '/my-events/:id/participants', element: <EventParticipantsPage /> },
  { path: '/my-events/:id/volunteers', element: <EventVolunteersPage /> },
  { path: '/my-events/:id/services', element: <EventServicesPage /> },

  // Vendor
  { path: '/my-venues', element: <MyVenuesPage /> },
  { path: '/my-venues/create', element: <CreateVenuePage /> },
  { path: '/my-venues/:id/edit', element: <EditVenuePage /> },
  { path: '/my-services', element: <MyServicesPage /> },
  { path: '/my-services/create', element: <CreateServicePage /> },
  { path: '/my-services/:id/edit', element: <EditServicePage /> },

  // Admin
  { path: '/admin/dashboard', element: <AdminDashboardPage /> },
  { path: '/admin/users', element: <AdminUsersPage /> },
]
