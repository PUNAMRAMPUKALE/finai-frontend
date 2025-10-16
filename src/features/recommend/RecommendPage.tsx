import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { API } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ColumnDef } from '@tanstack/react-table'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/table'

type Row = { id: string; name: string; why: string; score: number }

export default function RecommendPage() {
  const [goal, setGoal] = React.useState('retirement')
  const [risk, setRisk] = React.useState('moderate')
  const [horizon, setHorizon] = React.useState<number>(10)
  const [prefs, setPrefs] = React.useState('low fee, global')
  const [cons, setCons] = React.useState('no tobacco')

  const mutation = useMutation({
    mutationFn: async () =>
      API.recommend({
        profile: {
          goal,
          risk,
          horizon_years: horizon,
          preferences: prefs.split(',').map((s) => s.trim()).filter(Boolean),
          constraints: cons.split(',').map((s) => s.trim()).filter(Boolean),
        },
      }),
  })

  

  const columns: ColumnDef<Row>[] = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Why', accessorKey: 'why' },
    { header: 'Score', accessorKey: 'score' },
  ]

  const rows: Row[] = (mutation.data as any)?.products ?? []
  const table = useReactTable<Row>({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">LLM-based Recommendations</h2>

      <div className="grid gap-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Goal</Label>
            <Input value={goal} onChange={(e) => setGoal(e.target.value)} />
          </div>

          <div>
            <Label>Risk</Label>
            <Input value={risk} onChange={(e) => setRisk(e.target.value)} />
          </div>

          <div>
            <Label>Horizon (years)</Label>
            <Input
              type="number"
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Preferences (comma sep)</Label>
            <Input value={prefs} onChange={(e) => setPrefs(e.target.value)} />
          </div>

          <div className="col-span-2">
            <Label>Constraints (comma sep)</Label>
            <Input value={cons} onChange={(e) => setCons(e.target.value)} />
          </div>
        </div>

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
  {mutation.isPending ? 'Matching…' : 'Get Recommendations'}
</Button>


        {mutation.isSuccess && (
          <>
            <DataTable table={table} />
            <p className="text-sm text-zinc-600 max-w-3xl">
              {(mutation.data as any).explanation}
            </p>
          </>
        )}

        {mutation.isError && (
          <p className="text-sm text-red-600">
            {(mutation.error as Error).message}
          </p>
        )}
      </div>
    </div>
  )
}
