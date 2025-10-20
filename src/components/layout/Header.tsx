import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export default function Header() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-zinc-900">FinAI</Link>

        {!user ? (
          <div className="flex gap-4 text-sm">
            <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
            <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-zinc-600">{user.email}</span>
            <button
              onClick={() => { logout(); nav('/login', { replace: true }) }}
              className="rounded-md bg-zinc-900 text-white px-3 py-1"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}