import * as React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)
  const { login } = useAuth()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(null)
    try { await login(email, password) } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Log in</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" disabled={busy} className="mt-1 px-4 py-2 rounded bg-black text-white disabled:opacity-60">
          {busy ? 'Signing in…' : 'Login'}
        </button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>
      <p className="text-sm text-zinc-600 mt-4">No account? <Link to="/register" className="underline">Register</Link></p>
    </div>
  )
}