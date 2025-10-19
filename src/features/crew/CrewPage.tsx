import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { API } from '@/lib/api/api'
import type { CrewAdviceResponse } from '@/lib/types'

export default function CrewPage() {
  const [question, setQ] = React.useState('What ETFs suit a conservative retiree?')
  const [profile, setProfile] = React.useState('{"risk":"conservative","goal":"retirement"}')
  const [data, setData] = React.useState<CrewAdviceResponse | null>(null)
  const ask = async () => {
    const p = JSON.parse(profile)
    const r = await API.crewAdvice<CrewAdviceResponse>({ question, profile: p })
    setData(r)
  }
  return (
    <div className="space-y-4">
      <Input value={question} onChange={e=>setQ(e.target.value)} />
      <Textarea rows={6} value={profile} onChange={e=>setProfile(e.target.value)} />
      <Button onClick={ask}>Run Crew</Button>
      {data && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border app-border app-card p-4"><div className="font-semibold">Research</div><p className="text-sm mt-1 whitespace-pre-wrap">{data.research}</p></div>
          <div className="rounded-2xl border app-border app-card p-4"><div className="font-semibold">Product Match</div><pre className="text-xs overflow-auto">{data.product_match}</pre></div>
          <div className="sm:col-span-2 rounded-2xl border app-border app-card p-4"><div className="font-semibold">Crew Summary</div><p className="text-sm mt-1 whitespace-pre-wrap">{data.crew_summary}</p></div>
        </div>
      )}
    </div>
  )
}
