import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { API } from '@/lib/api/api'
import type { UpsertProfileResponse } from '@/lib/types'

export default function ProfilePage() {
  const [profile_id, setId] = React.useState('u1')
  const [goal, setGoal] = React.useState('retirement')
  const [risk, setRisk] = React.useState('moderate')
  const [horizon_years, setHorizon] = React.useState(10)
  const [preferences, setPrefs] = React.useState('low fee, global')
  const [constraints, setCons] = React.useState('no tobacco')

  const [msg, setMsg] = React.useState<string | null>(null)

  const save = async () => {
    const res = await API.upsertProfile<UpsertProfileResponse>({
      profile_id, goal, risk, horizon_years,
      preferences: preferences.split(',').map(s=>s.trim()).filter(Boolean),
      constraints: constraints.split(',').map(s=>s.trim()).filter(Boolean),
    })
    setMsg(`Saved: ${res.profile_id}`)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>ID</Label><Input value={profile_id} onChange={e=>setId(e.target.value)} /></div>
        <div><Label>Goal</Label><Input value={goal} onChange={e=>setGoal(e.target.value)} /></div>
        <div><Label>Risk</Label><Input value={risk} onChange={e=>setRisk(e.target.value)} /></div>
        <div><Label>Horizon</Label><Input type="number" value={horizon_years} onChange={e=>setHorizon(Number(e.target.value))} /></div>
        <div className="col-span-2"><Label>Preferences</Label><Input value={preferences} onChange={e=>setPrefs(e.target.value)} /></div>
        <div className="col-span-2"><Label>Constraints</Label><Input value={constraints} onChange={e=>setCons(e.target.value)} /></div>
      </div>
      <Button onClick={save}>Save Profile</Button>
      {msg && <div className="text-sm text-green-700">{msg}</div>}
    </div>
  )
}
