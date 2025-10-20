import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Pill } from '@/components/ui/Pill'
import { Progress } from '@/components/ui/Progress'

type Match = {
  name?: string
  thesis?: string
  sectors?: string[] | string
  stages?: string[] | string
  geo?: string
  region?: string
  checkSize?: string
  score?: number
  score_pct?: number
  distance?: number
}

const toList = (v?: string | string[]) =>
  !v ? null : Array.isArray(v) ? v.filter(Boolean).join(', ') : v

export function MatchCard({ m, index }: { m: Match; index: number }) {
const pct =
  typeof m.score_pct === 'number' ? Math.round(m.score_pct) :
  typeof m.score === 'number'     ? Math.round(m.score * 100) :
  typeof m.distance === 'number'  ? Math.round((1 - Math.min(Math.max(m.distance, 0), 2) / 2) * 100) :
  0;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-base font-semibold truncate">{m.name || `Investor ${index+1}`}</div>
          {m.thesis && <p className="text-sm text-ink-400 mt-1 line-clamp-2">{m.thesis}</p>}
        </div>
        <Pill>{pct}% match</Pill>
      </div>

      <div className="mt-3"><Progress value={pct} /></div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-ink-500">
        {toList(m.sectors) && <div><span className="font-medium">Sectors:</span> {toList(m.sectors)}</div>}
        {toList(m.stages)  && <div><span className="font-medium">Stages:</span> {toList(m.stages)}</div>}
        {(m.region || m.geo) && <div className="col-span-2"><span className="font-medium">Region:</span> {m.region || m.geo}</div>}
        {m.checkSize && <div className="col-span-2"><span className="font-medium">Check size:</span> {m.checkSize}</div>}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button className="rounded-lg px-3 py-2 text-sm font-medium border app-border hover:border-brand-300"
                onClick={() => alert('Open investor profile')}>
          View profile
        </button>
        <button className="rounded-lg px-3 py-2 text-sm font-medium text-white"
                style={{ background: 'var(--accent)' }}
                onClick={() => alert('Shortlisted')}>
          Shortlist
        </button>
      </div>
    </Card>
  )
}