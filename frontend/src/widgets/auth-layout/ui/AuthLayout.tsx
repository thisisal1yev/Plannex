import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Planner AI</h1>
          <p className="text-muted-foreground mt-1 text-sm">Tadbirlarni tashkil etish marketi</p>
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
