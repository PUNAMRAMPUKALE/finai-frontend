import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { API } from '@/lib/api/api'
import type { GraphSyncResponse, CypherResponse } from '@/lib/types'

export default function GraphPage() {
  const [query, setQuery] = React.useState('MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 10')
  const [rows, setRows] = React.useState<CypherResponse['rows']>([])
  const [msg, setMsg] = React.useState<string | null>(null)

  const sync = async () => {
    const r = await API.graphSync<GraphSyncResponse>()
    setMsg(`Inserted ${r.inserted} triples`)
  }
  const run = async () => {
    const r = await API.graphQuery<CypherResponse>({ query })
    setRows(r.rows || [])
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={sync}>Build KG from Docs</Button>
        {msg && <div className="text-sm text-zinc-600">{msg}</div>}
      </div>
      <div className="space-y-2">
        <Textarea value={query} onChange={e=>setQuery(e.target.value)} rows={6} />
        <Button onClick={run}>Run Cypher</Button>
      </div>
      {!!rows.length && (
        <div className="rounded-2xl border app-border app-card p-4">
          <div className="text-sm font-semibold mb-2">Rows</div>
          <pre className="text-xs overflow-auto">{JSON.stringify(rows, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
