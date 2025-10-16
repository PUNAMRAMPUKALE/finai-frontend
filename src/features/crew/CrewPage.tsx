import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'


export default function CrewPage() {
const [question, setQuestion] = React.useState('What suits a moderate investor seeking global exposure?')
const [profile, setProfile] = React.useState('{"risk":"moderate","goal":"growth","horizon_years":8}')


const m = useMutation({
mutationFn: async () => {
const body = { question, profile: JSON.parse(profile) }
const res = await fetch('/api/v1/crew/advice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
return res.json()
}
})


return (
<div className="grid gap-4 max-w-3xl">
<h2 className="text-xl font-semibold">CrewAI Orchestration</h2>
<Textarea value={question} onChange={e=>setQuestion(e.target.value)} />
<Textarea value={profile} onChange={e=>setProfile(e.target.value)} />
<Button onClick={()=>m.mutate()} disabled={m.isPending}>{m.isPending ? 'Running…' : 'Run Crew'}</Button>
{m.isSuccess && (
<div className="space-y-3">
<div className="text-sm"><b>Research:</b> {(m.data as any).research}</div>
<div className="text-sm"><b>Product Match:</b> {(m.data as any).product_match}</div>
<div className="text-sm"><b>Summary:</b> {(m.data as any).crew_summary}</div>
</div>
)}
{m.isError && <p className="text-sm text-red-600">{(m.error as Error).message}</p>}
</div>
)
}