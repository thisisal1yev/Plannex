import { Outlet, useLocation } from 'react-router'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/shared/ui/primitives/sidebar'
import { AppSidebar } from './AppSidebar'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Boshqaruv paneli',
  '/admin/users': 'Foydalanuvchilar',
  '/admin/events': 'Tadbirlar',
  '/admin/venues': 'Maydonlar',
  '/my-events': 'Mening tadbirlarim',
  '/my-venues': 'Mening maydonlarim',
  '/my-services': 'Mening xizmatlarim',
  '/tickets': 'Mening chiptalаrim',
  '/profile': 'Profil',
}

export function AppLayout() {
  const location = useLocation()

  const matched = Object.entries(PAGE_TITLES).find(
    ([path]) => location.pathname === path || location.pathname.startsWith(path + '/')
  )
  const title = matched?.[1] ?? ''

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="border-border/60 bg-background/95 sticky top-0 z-40 flex h-12 shrink-0 items-center gap-3 border-b px-4 backdrop-blur-sm">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground -ml-1 transition-colors" />
          {title && (
            <>
              <div className="bg-border h-3.5 w-px rounded-full" />
              <h1 className="text-foreground/90 text-[13px] font-medium tracking-tight">{title}</h1>
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
