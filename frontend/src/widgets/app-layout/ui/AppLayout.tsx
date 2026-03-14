import { Outlet } from 'react-router'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/shared/ui/primitives/sidebar'
import { AppSidebar } from './AppSidebar'

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
