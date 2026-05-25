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
import { PartnersPage } from '@pages/partners'
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
import { VendorDashboardPage } from '@pages/vendor-dashboard'
import { MyVenuesPage, MyVenueDetailPage } from '@pages/my-venues'
import { CreateVenuePage } from '@pages/create-venue'
import { EditVenuePage } from '@pages/edit-venue'
import { MyServicesPage, MyServiceDetailPage } from '@pages/my-services'
import { CreateServicePage } from '@pages/create-service'
import { EditServicePage } from '@pages/edit-service'

// Admin
import { AdminUsersPage } from '@pages/admin-users'
import { AdminDashboardPage } from '@pages/admin-dashboard'
import { AdminEventsPage } from '@pages/admin-events'
import { AdminVenuesPage } from '@pages/admin-venues'

function ComingSoon() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
      <h2 className="text-xl font-semibold">Coming Soon</h2>
      <p className="text-muted-foreground text-sm">Bu bo'lim tez orada ishga tushadi.</p>
    </div>
  )
}

function RoleDashboard() {
  const user = useAuthStore((s) => s.user)
  switch (user?.role) {
    case 'ORGANIZER':
      return <OrganizerDashboardPage />
    case 'VENDOR':
      return <VendorDashboardPage />
    case 'ADMIN':
      return <AdminDashboardPage />
    default:
      return <ComingSoon />
  }
}

export function AppRouter() {
  const isAuth = !!useAuthStore((s) => s.accessToken)

  return (
    <Routes>
      {/* ── Landing (public, marketing header + footer) ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* ── Auth pages ── */}
      <Route
        path="/login"
        element={
          <GuestOnly>
            <AuthPage />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <AuthPage />
          </GuestOnly>
        }
      />

      {/* OAuth callback — no auth required, no layout wrapper */}
      <Route path="/auth/callback" element={<OAuthCallbackPage />} />

      {/* ── Sidebar layout — all authenticated pages ── */}
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<RoleDashboard />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin */}
        <Route
          path="/admin/users"
          element={
            <RequireRole role="ADMIN">
              <AdminUsersPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/events"
          element={
            <RequireRole role="ADMIN">
              <AdminEventsPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/venues"
          element={
            <RequireRole role="ADMIN">
              <AdminVenuesPage />
            </RequireRole>
          }
        />

        {/* Participant */}
        <Route
          path="/tickets"
          element={
            <RequireRole role="PARTICIPANT">
              <MyTicketsPage />
            </RequireRole>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <RequireRole role="PARTICIPANT">
              <TicketDetailPage />
            </RequireRole>
          }
        />

        {/* Organizer */}
        <Route
          path="/my-events"
          element={
            <RequireRole role="ORGANIZER">
              <MyEventsPage />
            </RequireRole>
          }
        />
        <Route
          path="/my-events/create"
          element={
            <RequireRole role="ORGANIZER">
              <CreateEventPage />
            </RequireRole>
          }
        />
        <Route
          path="/my-events/:id"
          element={
            <RequireRole role="ORGANIZER">
              <MyEventDetailPage />
            </RequireRole>
          }
        />
        <Route
          path="/my-events/:id/edit"
          element={
            <RequireRole role="ORGANIZER">
              <EditEventPage />
            </RequireRole>
          }
        />
        <Route
          path="/my-events/:id/participants"
          element={
            <RequireRole role="ORGANIZER">
              <EventParticipantsPage />
            </RequireRole>
          }
        />
        <Route
          path="/my-events/:id/volunteers"
          element={
            <RequireRole role="ORGANIZER">
              <EventVolunteersPage />
            </RequireRole>
          }
        />
        <Route
          path="/my-events/:id/services"
          element={
            <RequireRole role="ORGANIZER">
              <EventServicesPage />
            </RequireRole>
          }
        />

        {/* Vendor */}
        <Route
          path="/my-venues"
          element={
            <RequireRole role="VENDOR">
              <MyVenuesPage />
            </RequireRole>
          }
        />
        <Route
          path="/my-venues/create"
          element={
            <RequireRole role="VENDOR">
              <CreateVenuePage />
            </RequireRole>
          }
        />
        <Route
          path="/my-venues/:id"
          element={
            <RequireRole role="VENDOR">
              <MyVenueDetailPage />
            </RequireRole>
          }
        />
        <Route
          path="/my-venues/:id/edit"
          element={
            <RequireRole role="VENDOR">
              <EditVenuePage />
            </RequireRole>
          }
        />
        <Route
          path="/my-services"
          element={
            <RequireRole role="VENDOR">
              <MyServicesPage />
            </RequireRole>
          }
        />
        <Route
          path="/my-services/create"
          element={
            <RequireRole role="VENDOR">
              <CreateServicePage />
            </RequireRole>
          }
        />
        <Route
          path="/my-services/:id"
          element={
            <RequireRole role="VENDOR">
              <MyServiceDetailPage />
            </RequireRole>
          }
        />
        <Route
          path="/my-services/:id/edit"
          element={
            <RequireRole role="VENDOR">
              <EditServicePage />
            </RequireRole>
          }
        />
      </Route>

      {/* ── Public browsing — marketplace header layout ── */}
      <Route element={<UserLayout />}>
        <Route path="/events" element={<EventsListPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/venues" element={<VenuesListPage />} />
        <Route path="/venues/:id" element={<VenueDetailPage />} />
        <Route path="/services" element={<ServicesListPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuth ? '/events' : '/'} replace />} />
    </Routes>
  )
}
