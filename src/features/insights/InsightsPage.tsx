import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { API } from '@/lib/api/api'
import type { InsightsResponse } from '@/lib/types'

export default function InsightsPage() {
  const [q, setQ] = React.useState('What APAC yield figures are mentioned?')
  const [data, setData] = React.useState<InsightsResponse | null>(null)
  const [busy, setBusy] = React.useState(false)

  const ask = async () => {
    setBusy(true)
    try {
      const r = await API.insights<InsightsResponse>({ question: q, top_k: 5 })
      setData(r)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} />
        <Button onClick={ask} disabled={busy}>
          {busy ? 'Asking…' : 'Ask'}
        </Button>
      </div>

      {data && (
        <div className="space-y-2">
          <div className="rounded-2xl border app-border app-card p-4">
            <div className="text-sm font-semibold">Answer</div>
            <p className="text-sm text-zinc-600 mt-1 whitespace-pre-wrap">
              {data.answer}
            </p>
          </div>
          <div className="rounded-2xl border app-border app-card p-4">
            <div className="text-sm font-semibold">Sources</div>
            <ul className="text-sm text-zinc-600 mt-1 list-disc list-inside">
              {data.sources.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
