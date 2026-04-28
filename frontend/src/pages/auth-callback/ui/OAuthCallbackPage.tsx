import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@shared/model/auth.store'
import { usersApi } from '@entities/user'

const ROLE_ROUTES: Record<string, string> = {
  ADMIN: '/admin/dashboard',
  ORGANIZER: '/dashboard',
  VENDOR: '/my-venues',
  VOLUNTEER: '/events',
  PARTICIPANT: '/events',
}

export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('accessToken')
    const refreshToken = params.get('refreshToken')

    if (!accessToken || !refreshToken) {
      navigate('/login?error=oauth_failed', { replace: true })
      return
    }

    setTokens({ accessToken, refreshToken })

    usersApi
      .me()
      .then((user) => {
        setUser(user)
        navigate(ROLE_ROUTES[user.role] ?? '/events', { replace: true })
      })
      .catch(() => {
        useAuthStore.getState().logout()
        navigate('/login?error=oauth_failed', { replace: true })
      })
  }, [navigate, setTokens, setUser])

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-dark">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-cream/50">Tizimga kirilmoqda…</p>
      </div>
    </div>
  )
}
