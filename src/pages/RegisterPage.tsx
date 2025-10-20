import * as React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API } from '@/lib/api/api'

export default function RegisterPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [ok, setOk] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setErr(null)
    try { await API.register({ email, password }); setOk(true); setTimeout(()=>navigate('/login', {replace: true}), 1200) }
    catch (e) { setErr((e as Error).message) }
    finally { setBusy(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Create an account</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <input className="border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" disabled={busy} className="mt-1 px-4 py-2 rounded bg-black text-white disabled:opacity-60">
          {busy ? 'Creating…' : 'Register'}
        </button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>

      {ok && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-base font-medium">Registration successful</div>
            <p className="text-sm text-zinc-600 mt-1">Redirecting to login…</p>
          </div>
        </div>
      )}

      <p className="text-sm text-zinc-600 mt-4">Already have an account? <Link to="/login" className="underline">Log in</Link></p>
    </div>
  )
}