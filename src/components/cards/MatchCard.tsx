// src/components/cards/MatchCard.tsx
import * as React from 'react'

type MaybeArray = string | string[] | undefined

export type MatchItem = {
  name?: string
  thesis?: string
  sectors?: string[] | string
  sector?: string
  stage?: string
  stages?: string[] | string
  region?: string
  geo?: string
  checkSize?: string
  // scoring (backend may return either)
  score_pct?: number   // 0..100
  score?: number       // 0..1
}

type Props = {
  item: MatchItem
}

function toList(val: MaybeArray): string | null {
  if (!val) return null
  return Array.isArray(val) ? val.filter(Boolean).join(', ') : val
}

export function MatchCard({ item }: Props) {
  const pct =
    typeof item.score_pct === 'number'
      ? Math.max(0, Math.min(100, Math.round(item.score_pct)))
      : typeof item.score === 'number'
        ? Math.max(0, Math.min(100, Math.round(item.score * 100)))
        : null

  const sectors = toList(item.sectors ?? item.sector)
  const stages  = toList(item.stages ?? item.stage)
  const region  = toList(item.region ?? item.geo)

  return (
    <div className="rounded-2xl border app-border app-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">
            {item.name ?? 'Investor'}
          </div>
          {item.thesis && (
            <p className="mt-1 text-sm text-zinc-700">
              {item.thesis}
            </p>
          )}
        </div>

        {/* % badge */}
        <div
          aria-label={pct !== null ? `Match ${pct}%` : 'No score'}
          className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold"
          style={{ background: 'var(--accent-50)', color: 'var(--accent)' }}
        >
          {pct !== null ? `${pct}%` : '—'}
        </div>
      </div>

      <div className="mt-3 text-sm text-zinc-700 space-y-1">
        {sectors && (
          <p><span className="font-medium">Sectors:</span> {sectors}</p>
        )}
        {stages && (
          <p><span className="font-medium">Stages:</span> {stages}</p>
        )}
        {region && (
          <p><span className="font-medium">Region:</span> {region}</p>
        )}
        {item.checkSize && (
          <p><span className="font-medium">Check size:</span> {item.checkSize}</p>
        )}
      </div>
    </div>
  )
}
