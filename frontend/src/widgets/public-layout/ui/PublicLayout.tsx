import { Outlet } from 'react-router'
import { AppHeader } from '@widgets/header'
import { Footer } from '@widgets/footer'

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
