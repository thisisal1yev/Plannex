import type { RouteObject } from 'react-router'
import { HomePage } from '@pages/home'
import { EventsListPage } from '@pages/events-list'
import { EventDetailPage } from '@pages/event-detail'
import { VenuesListPage } from '@pages/venues-list'
import { VenueDetailPage } from '@pages/venue-detail'
import { ServicesListPage } from '@pages/services-list'
import { ServiceDetailPage } from '@pages/service-detail'
import { AuthPage } from '@pages/auth'

export const publicRoutes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <AuthPage /> },
  { path: '/register', element: <AuthPage /> },
  { path: '/events', element: <EventsListPage /> },
  { path: '/events/:id', element: <EventDetailPage /> },
  { path: '/venues', element: <VenuesListPage /> },
  { path: '/venues/:id', element: <VenueDetailPage /> },
  { path: '/services', element: <ServicesListPage /> },
  { path: '/services/:id', element: <ServiceDetailPage /> },
]
