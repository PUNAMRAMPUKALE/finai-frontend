import * as React from 'react'
import PdfUploadHero from '@/components/upload/PdfUploadHero'
import { API } from '@/lib/api/api'
import { MatchCard, type MatchItem } from '@/components/cards/MatchCard'

type PitchResp = { mode: string; matches: MatchItem[]; explanation?: string }

export default function StartupPitchSection() {
  const [data, setData] = React.useState<PitchResp | null>(null)
  const [err, setErr] = React.useState<string | null>(null)

  // Called by PdfUploadHero when user uploads a pitch PDF
  const handleSubmit = async (file: File) => {
    setErr(null)
    try {
      const fd = new FormData()
      fd.append('file', file)

      // Call your backend
      const res = await API.recommendPitchFile<PitchResp>(fd)

      // Normalize score → score_pct for UI
      res.matches = (res.matches || []).map(m => ({
        ...m,
        score_pct:
          typeof m.score_pct === 'number'
            ? m.score_pct
            : typeof m.score === 'number'
              ? Math.max(0, Math.min(100, Math.round(m.score * 100)))
              : undefined,
      }))
      setData(res)
    } catch (e) {
      setErr((e as Error).message)
    }
  }

  return (
    <section className="space-y-6">
      {/* 1️⃣ Hero Upload Section */}
      <PdfUploadHero
        mode="upload-only"
        submitLabel="Upload Pitch & Match"
        onSubmit={handleSubmit}
      />

      {/* 2️⃣ Error Display */}
      {err && <p className="text-sm text-red-600">{err}</p>}

      {/* 3️⃣ Matching Results */}
      {data && (
        <div className="grid gap-4 sm:grid-cols-1">
          {data.matches.map((m, i) => (
            <MatchCard key={i} item={m} />
          ))}
        </div>
      )}
    </section>
  )
}