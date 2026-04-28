import { Routes, Route, Navigate } from 'react-router'
import { useAuthStore } from '@shared/model/auth.store'

// Middleware
import { RequireAuth, RequireRole, GuestOnly } from './middleware'

// Layouts
import { PublicLayout } from '@widgets/public-layout'
import { AppLayout } from '@widgets/app-layout'
import { UserLayout } from '@widgets/user-layout'

// Public pages
import { HomePage } from '@pages/home'
import { AboutPage } from '@pages/about'
import { BlogPage } from '@pages/blog'
import { PrivacyPage } from '@pages/privacy'
import { TermsPage } from '@pages/terms'

// Auth pages
import { AuthPage } from '@pages/auth'
import { OAuthCallbackPage } from '@pages/auth-callback'

// Browsing
import { EventsListPage } from '@pages/events-list'
import { EventDetailPage } from '@pages/event-detail'
import { VenuesListPage } from '@pages/venues-list'
import { VenueDetailPage } from '@pages/venue-detail'
import { ServicesListPage } from '@pages/services-list'
import { ServiceDetailPage } from '@pages/service-detail'

// Common authenticated
import { ProfilePage } from '@pages/profile'

// Participant
import { MyTicketsPage } from '@pages/my-tickets'
import { TicketDetailPage } from '@pages/ticket-detail'

// Organizer
import { OrganizerDashboardPage } from '@pages/organizer-dashboard'
import { MyEventsPage, MyEventDetailPage } from '@pages/my-events'
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
import { AdminEventsPage } from '@pages/admin-events'
import { AdminVenuesPage } from '@pages/admin-venues'

export function AppRouter() {
  const isAuth = !!useAuthStore((s) => s.accessToken)

  return (
    <Routes>
      {/* ── Landing (public, marketing header + footer) ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* ── Auth pages ── */}
      <Route path="/login"    element={<GuestOnly><AuthPage /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><AuthPage /></GuestOnly>} />

      {/* OAuth callback — no auth required, no layout wrapper */}
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />

      {/* ── Admin — sidebar dashboard layout ── */}
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="/admin/dashboard" element={<RequireRole role="ADMIN"><AdminDashboardPage /></RequireRole>} />
        <Route path="/admin/users"     element={<RequireRole role="ADMIN"><AdminUsersPage /></RequireRole>} />
        <Route path="/admin/events"    element={<RequireRole role="ADMIN"><AdminEventsPage /></RequireRole>} />
        <Route path="/admin/venues"    element={<RequireRole role="ADMIN"><AdminVenuesPage /></RequireRole>} />
      </Route>

      {/* ── Everyone else — marketplace header layout ── */}
      <Route element={<UserLayout />}>
        {/* Public browsing (no auth required) */}
        <Route path="/events"       element={<EventsListPage />} />
        <Route path="/events/:id"   element={<EventDetailPage />} />
        <Route path="/venues"       element={<VenuesListPage />} />
        <Route path="/venues/:id"   element={<VenueDetailPage />} />
        <Route path="/services"     element={<ServicesListPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />

        {/* Common authenticated */}
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

        {/* PARTICIPANT */}
        <Route path="/tickets"    element={<RequireAuth><RequireRole role="PARTICIPANT"><MyTicketsPage /></RequireRole></RequireAuth>} />
        <Route path="/tickets/:id" element={<RequireAuth><RequireRole role="PARTICIPANT"><TicketDetailPage /></RequireRole></RequireAuth>} />

        {/* ORGANIZER */}
        <Route path="/dashboard"                     element={<RequireAuth><RequireRole role="ORGANIZER"><OrganizerDashboardPage /></RequireRole></RequireAuth>} />
        <Route path="/my-events"                     element={<RequireAuth><RequireRole role="ORGANIZER"><MyEventsPage /></RequireRole></RequireAuth>} />
        <Route path="/my-events/create"              element={<RequireAuth><RequireRole role="ORGANIZER"><CreateEventPage /></RequireRole></RequireAuth>} />
        <Route path="/my-events/:id"                 element={<RequireAuth><RequireRole role="ORGANIZER"><MyEventDetailPage /></RequireRole></RequireAuth>} />
        <Route path="/my-events/:id/edit"            element={<RequireAuth><RequireRole role="ORGANIZER"><EditEventPage /></RequireRole></RequireAuth>} />
        <Route path="/my-events/:id/participants"    element={<RequireAuth><RequireRole role="ORGANIZER"><EventParticipantsPage /></RequireRole></RequireAuth>} />
        <Route path="/my-events/:id/volunteers"      element={<RequireAuth><RequireRole role="ORGANIZER"><EventVolunteersPage /></RequireRole></RequireAuth>} />
        <Route path="/my-events/:id/services"        element={<RequireAuth><RequireRole role="ORGANIZER"><EventServicesPage /></RequireRole></RequireAuth>} />

        {/* VENDOR */}
        <Route path="/my-venues"           element={<RequireAuth><RequireRole role="VENDOR"><MyVenuesPage /></RequireRole></RequireAuth>} />
        <Route path="/my-venues/create"    element={<RequireAuth><RequireRole role="VENDOR"><CreateVenuePage /></RequireRole></RequireAuth>} />
        <Route path="/my-venues/:id/edit"  element={<RequireAuth><RequireRole role="VENDOR"><EditVenuePage /></RequireRole></RequireAuth>} />
        <Route path="/my-services"         element={<RequireAuth><RequireRole role="VENDOR"><MyServicesPage /></RequireRole></RequireAuth>} />
        <Route path="/my-services/create"  element={<RequireAuth><RequireRole role="VENDOR"><CreateServicePage /></RequireRole></RequireAuth>} />
        <Route path="/my-services/:id/edit" element={<RequireAuth><RequireRole role="VENDOR"><EditServicePage /></RequireRole></RequireAuth>} />
      </Route>

      <Route path="*" element={<Navigate to={isAuth ? '/events' : '/'} replace />} />
    </Routes>
  )
}
