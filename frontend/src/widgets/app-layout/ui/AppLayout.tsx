import { Outlet, useLocation } from 'react-router'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/shared/ui/primitives/sidebar'
import { AppSidebar } from './AppSidebar'

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Boshqaruv paneli',
  '/admin/users':     'Foydalanuvchilar',
  '/admin/events':    'Tadbirlar',
  '/admin/venues':    'Maydonlar',
  '/dashboard':       'Boshqaruv paneli',
  '/my-events':       'Mening tadbirlarim',
  '/my-venues':       'Mening maydonlarim',
  '/my-services':     'Mening xizmatlarim',
  '/tickets':         'Mening chiptalаrim',
  '/profile':         'Profil',
  '/events':          'Tadbirlar',
  '/venues':          'Maydonlar',
  '/services':        'Xizmatlar',
}

export function AppLayout() {
  const location = useLocation()

  const matched = Object.entries(PAGE_TITLES).find(([path]) =>
    location.pathname === path || location.pathname.startsWith(path + '/')
  )
  const title = matched?.[1] ?? ''

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border/60 bg-background/95 backdrop-blur-sm px-4 sticky top-0 z-10">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors -ml-1" />
          {title && (
            <>
              <div className="w-px h-3.5 bg-border rounded-full" />
              <h1 className="text-[13px] font-medium text-foreground/90 tracking-tight">{title}</h1>
            </>
          )}
        </header>
        <main className="flex-1 overflow-auto p-5">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
