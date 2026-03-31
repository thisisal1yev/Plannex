import { Outlet } from 'react-router'
import { Header } from '@widgets/header'

export function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
