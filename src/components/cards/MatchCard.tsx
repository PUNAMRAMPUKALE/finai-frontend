// src/components/cards/MatchCard.tsx
import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/Progress'
import { Link, useLocation } from 'react-router-dom'

type Match = {
  name?: string
  thesis?: string
  sectors?: string | string[]
  stages?: string | string[]
  geo?: string
  region?: string
  checkSize?: string
  score?: number
  score_pct?: number
  distance?: number
}

const toList = (v?: string | string[]) =>
  !v ? null : Array.isArray(v) ? v.filter(Boolean).join(', ') : v

function slugify(input: string) {
  return (input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')  // non-alnum → dash
    .replace(/^-+|-+$/g, '')      // trim leading/trailing dashes
}

export function MatchCard({ m, index }: { m: Match; index: number }) {
  const location = useLocation()

  const pct = React.useMemo(() => {
    if (typeof m?.score_pct === 'number' && !Number.isNaN(m.score_pct)) {
      return Math.max(0, Math.min(100, Math.round(m.score_pct)))
    }
    if (typeof m?.score === 'number' && !Number.isNaN(m.score)) {
      return Math.max(0, Math.min(100, Math.round(m.score * 100)))
    }
    if (typeof m?.distance === 'number' && !Number.isNaN(m.distance)) {
      const d = Math.max(0, Math.min(2, m.distance))
      return Math.round((1 - d / 2) * 100)
    }
    return 0
  }, [m])

  const title = m.name || `Investor ${index + 1}`
  const slug = slugify(title)

  return (
    // No onClick on Card — to avoid double navigations / random URL bits
    <Card className="p-5 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-base font-semibold truncate">{title}</div>
            <span className="text-xs px-2 py-0.5 rounded-full border bg-white">
              {pct}% match
            </span>
          </div>
          {m.thesis && (
            <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
              {m.thesis}
            </p>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <Progress value={pct} />
      </div>

      {/* Key details */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-zinc-600">
        {toList(m.sectors) ? (
          <div><span className="font-medium">Sectors:</span> {toList(m.sectors)}</div>
        ) : (
          <div><span className="font-medium">Sectors:</span> —</div>
        )}
        {toList(m.stages) ? (
          <div><span className="font-medium">Stages:</span> {toList(m.stages)}</div>
        ) : (
          <div><span className="font-medium">Stages:</span> —</div>
        )}
        {(m.region || m.geo) ? (
          <div className="col-span-2"><span className="font-medium">Region:</span> {m.region || m.geo}</div>
        ) : (
          <div className="col-span-2"><span className="font-medium">Region:</span> —</div>
        )}
        {m.checkSize ? (
          <div className="col-span-2"><span className="font-medium">Check size:</span> {m.checkSize}</div>
        ) : (
          <div className="col-span-2"><span className="font-medium">Check size:</span> —</div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-3">
        {/* Use Link and pass `from` so the profile page can return properly */}
        <Link
          to={`/investor/${slug}`}
          state={{ match: m, from: location.pathname }}
          className="rounded-lg px-3 py-2 text-sm font-medium border hover:border-indigo-300"
        >
          View profile
        </Link>

        <button
          type="button"
          className="rounded-lg px-3 py-2 text-sm font-medium text-white"
          style={{ background: 'var(--accent)' }}
          onClick={() => alert('Shortlisted')}
        >
          Shortlist
        </button>
      </div>
    </Card>
  )
}
