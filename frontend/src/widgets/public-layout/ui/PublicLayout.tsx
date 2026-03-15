import { Outlet } from 'react-router'
import { Header } from '../../header/ui/Header'
import { Footer } from '../../footer'

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
