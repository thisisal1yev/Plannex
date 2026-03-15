import { RegisterForm } from '@features/auth-register'

export function RegisterPage() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Ro'yxatdan o'tish</h2>
        <p className="text-sm text-muted-foreground mt-1">Yangi akkaunt yarating</p>
      </div>
      <RegisterForm />
    </>
  )
}
