import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { API } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export default function InsightsPage() {
const [q, setQ] = React.useState('What APAC yield figures are mentioned?')
const m = useMutation({ mutationFn: () => API.insights({ question: q, top_k: 5 }) })


return (
<div className="grid gap-4 max-w-2xl">
<h2 className="text-xl font-semibold">Ask Insights (RAG)</h2>
<Textarea value={q} onChange={e => setQ(e.target.value)} />
<Button onClick={() => m.mutate()} disabled={m.isPending}>{m.isPending ? 'Asking…' : 'Ask'}</Button>
{m.isSuccess && (
<div className="space-y-2">
<div className="text-sm text-zinc-800 whitespace-pre-wrap">{(m.data as any).answer}</div>
<div className="text-xs text-zinc-500">Sources: {(m.data as any).sources?.join(', ')}</div>
</div>
)}
{m.isError && <p className="text-sm text-red-600">{(m.error as Error).message}</p>}
</div>

)}