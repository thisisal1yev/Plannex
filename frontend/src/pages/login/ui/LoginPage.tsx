import { LoginForm } from '@features/auth-by-credentials'

export function LoginPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Kirish</h2>
        <p className="text-sm text-muted-foreground mt-1">Akkauntingizga kiring</p>
      </div>
      <LoginForm />
    </>
  )
}
