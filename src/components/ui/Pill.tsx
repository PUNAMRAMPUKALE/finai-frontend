import * as React from 'react'
export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-xl px-3 py-1 text-xs font-semibold"
      style={{ background: 'var(--accent-50)', color: 'var(--accent)' }}
    >
      {children}
    </span>
  )
}