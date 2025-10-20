import * as React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { API } from '@/lib/api/api'

type User = { id: string; email: string } | null
type Ctx = { user: User; login: (email: string, password: string) => Promise<void>; logout: () => void }

const AuthCtx = React.createContext<Ctx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(null)
  const navigate = useNavigate()

  React.useEffect(() => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token')
    if (!token) return
    ;(async () => {
      try { setUser(await API.me<{id:string; email:string}>()) }
      catch { localStorage.removeItem('access_token'); localStorage.removeItem('token'); setUser(null) }
    })()
  }, [])

  const login = React.useCallback(async (email: string, password: string) => {
    const r = await API.login<{ access_token: string }>({ email, password })
    localStorage.setItem('access_token', r.access_token)
    setUser(await API.me<{id:string; email:string}>())
    navigate('/', { replace: true })
  }, [navigate])

  const logout = React.useCallback(() => {
    localStorage.removeItem('access_token'); localStorage.removeItem('token')
    setUser(null); navigate('/login', { replace: true })
  }, [navigate])

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}