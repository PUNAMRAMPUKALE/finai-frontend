import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { API } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


export default function ProfilePage() {
const [profile_id, setId] = React.useState('u1')
const [goal, setGoal] = React.useState('retirement')
const [risk, setRisk] = React.useState('moderate')
const [horizon_years, setHorizon] = React.useState(10)
const [preferences, setPrefs] = React.useState('low fee, global')
const [constraints, setCons] = React.useState('no tobacco')


const m = useMutation({
mutationFn: () => API.profileUpsert({
profile_id,
goal,
risk,
horizon_years,
preferences: preferences.split(',').map(s=>s.trim()).filter(Boolean),
constraints: constraints.split(',').map(s=>s.trim()).filter(Boolean)
})
})


return (
<div className="grid gap-4 max-w-xl">
<h2 className="text-xl font-semibold">Create/Update Profile</h2>
<Label>Profile ID</Label>
<Input value={profile_id} onChange={e=>setId(e.target.value)} />
<Label>Goal</Label>
<Input value={goal} onChange={e=>setGoal(e.target.value)} />
<Label>Risk</Label>
<Input value={risk} onChange={e=>setRisk(e.target.value)} />
<Label>Horizon (years)</Label>
<Input type="number" value={horizon_years} onChange={e=>setHorizon(Number(e.target.value))} />
<Label>Preferences</Label>
<Input value={preferences} onChange={e=>setPrefs(e.target.value)} />
<Label>Constraints</Label>
<Input value={constraints} onChange={e=>setCons(e.target.value)} />
<Button onClick={()=>m.mutate()} disabled={m.isPending}>{m.isPending ? 'Saving…' : 'Save'}</Button>
{m.isSuccess && <p className="text-sm text-green-600">Saved.</p>}
{m.isError && <p className="text-sm text-red-600">{(m.error as Error).message}</p>}
</div>
)
}