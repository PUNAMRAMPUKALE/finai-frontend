import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { API } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'


export default function GraphPage() {
const [q, setQ] = React.useState('MATCH (s:Entity)-[r]->(o:Entity) RETURN s.name AS s, type(r) AS rel, o.name AS o LIMIT 10')
const sync = useMutation({ mutationFn: () => API.graphSync(100) })
const query = useMutation({ mutationFn: () => API.graphQuery(q) })


return (
<div className="space-y-4">
<h2 className="text-xl font-semibold">Knowledge Graph</h2>
<div className="flex gap-2">
<Button onClick={()=>sync.mutate()} disabled={sync.isPending}>{sync.isPending ? 'Syncing…' : 'Sync from Docs'}</Button>
{sync.isSuccess && <p className="text-sm text-green-600">Inserted: {(sync.data as any).inserted}</p>}
</div>
<Textarea value={q} onChange={e=>setQ(e.target.value)} />
<Button onClick={()=>query.mutate()} disabled={query.isPending}>{query.isPending ? 'Querying…' : 'Run Cypher'}</Button>
{query.isSuccess && (
<pre className="rounded-2xl bg-zinc-900 p-4 text-xs text-zinc-50 overflow-auto">{JSON.stringify(query.data, null, 2)}</pre>
)}
{query.isError && <p className="text-sm text-red-600">{(query.error as Error).message}</p>}
</div>
)
}