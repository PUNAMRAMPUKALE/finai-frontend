// src/pages/InvestorProfile.tsx
import * as React from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { API } from '@/lib/api/api'
import { useAppSelector } from '@/store'

type Agent = { agent: string; summary: string; bullets: string[] }
type Analysis = { context_snippets: { text: string; score: number }[]; agents: Agent[]; score_hint: number }

function deslugify(slug: string) {
  try {
    return decodeURIComponent(slug.replace(/-/g, ' '))
  } catch {
    return slug
  }
}

type QAItem = { q: string; a: string }

export default function InvestorProfile() {
  const { name = '' } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const from = (location.state as any)?.from || '/'
  const passedMatch = (location.state as any)?.match

  const lastPitchQueryRedux = useAppSelector((s) => s.matches.lastPitchQuery)
  const pitchSummary = lastPitchQueryRedux ?? sessionStorage.getItem('lastPitchQuery') ?? ''

  const [profile, setProfile] = React.useState<any>(passedMatch || null)
  const [analysis, setAnalysis] = React.useState<Analysis | null>(null)
  const [q, setQ] = React.useState('')
  const [answer, setAnswer] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)

  // NEW: Precomputed Q&A state
  const [preQA, setPreQA] = React.useState<QAItem[] | null>(null)
  const [preQALoading, setPreQALoading] = React.useState(false)

  const displayName = profile?.name || deslugify(name)

  // These 4 will be asked automatically and shown BEFORE the ask box
  const initialQuestions = React.useMemo(
    () => [
      'What type of startups best align with this investor’s thesis?',
      'How does my startup fit into this investor’s focus areas?',
      'What are this investor’s preferred sectors or technologies?',
      'Does this investor have a regional focus or global investment strategy?',
    ],
    []
  )

  // These will be shown as “Notes / Suggested questions” AFTER the ask box
  const suggestedNotes = React.useMemo(
    () => [
      'Why was this investor considered a strong match for my pitch?',
      'Which aspects of my pitch should I emphasize to this investor?',
      'Has this investor previously invested in similar startups?',
      'What’s their typical check size and stage preference?',
      'What questions might they ask during due diligence?',
      'Which portfolio companies could be a good intro path?',
    ],
    []
  )

  React.useEffect(() => {
    (async () => {
      if (!profile?.name) {
        try {
          const p = await API.getInvestor(displayName)
          setProfile(p)
        } catch {
          // Allow page to render minimal info even if fetch fails
        }
      }
      try {
        const a = await API.analyzeInvestor({ name: displayName, pitch_summary: pitchSummary })
        setAnalysis(a)
      } catch {
        /* optional */
      }

      // --- NEW: Pre-ask the 4 questions and collect answers ---
      setPreQALoading(true)
      try {
        const results = await Promise.all(
          initialQuestions.map(async (qq) => {
            try {
              const r = await API.qaInvestor({ name: displayName, question: qq, pitch_summary: pitchSummary })
              return { q: qq, a: String((r as any).answer ?? '') } as QAItem
            } catch (e) {
              return { q: qq, a: (e as Error).message }
            }
          })
        )
        setPreQA(results)
      } finally {
        setPreQALoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  function goBack() {
    if (window.history.length > 1) navigate(-1)
    else navigate(from || '/', { replace: true })
  }

  async function ask() {
    if (!q.trim()) return
    setBusy(true); setAnswer(null)
    try {
      const r = await API.qaInvestor({ name: displayName, question: q, pitch_summary: pitchSummary })
      setAnswer((r as any).answer)
    } catch (e) {
      setAnswer((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      {/* Back bar */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={goBack} className="text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50">
          ← Back
        </button>
        <div className="text-sm text-gray-500">Investor details</div>
      </div>

      {/* Hero */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{displayName}</h1>
        <p className="text-gray-500">{profile?.sectors || ''} • {profile?.stages || ''}</p>
        <p className="text-sm text-gray-400">{profile?.geo || '—'} | {profile?.checkSize || '—'}</p>
      </div>

      {/* Why match */}
      {analysis && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Why this is a strong match</h2>
          <p className="text-gray-600">
            Based on your pitch and {displayName}’s thesis, alignment is
            <strong> {analysis.score_hint}%</strong> across sector, stage and region.
          </p>
          <div className="grid md:grid-cols-3 gap-3 mt-4">
            {analysis.agents.map((a, i) => (
              <div key={i} className="rounded-xl border p-4 bg-white">
                <div className="text-sm font-semibold">{a.agent}</div>
                <div className="text-xs text-gray-500 mt-1">{a.summary}</div>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                  {a.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* === NEW: Precomputed Q&A (before Ask section) === */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Key Questions & Answers</h2>
        {preQALoading && <div className="text-sm text-gray-500">Fetching answers…</div>}
        {!preQALoading && (preQA?.length ?? 0) === 0 && (
          <div className="text-sm text-gray-500">No answers yet.</div>
        )}
        <div className="space-y-4">
          {preQA?.map((item, idx) => (
            <div key={idx} className="rounded-lg border p-4 bg-white">
              <div className="text-sm font-semibold">Q. {item.q}</div>
              <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{item.a || '—'}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Overview */}
      {profile && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Investor Overview</h2>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
            <div><strong>Region:</strong> {profile.geo || '—'}</div>
            <div><strong>Stage Focus:</strong> {profile.stages || '—'}</div>
            <div><strong>Check Size:</strong> {profile.checkSize || '—'}</div>
            <div><strong>Sectors:</strong> {profile.sectors || '—'}</div>
          </div>
          {profile.thesis && <p className="mt-4 text-gray-600"><strong>Thesis:</strong> {profile.thesis}</p>}
          {profile.constraints && <p className="mt-2 text-gray-600"><strong>Constraints:</strong> {profile.constraints}</p>}
        </Card>
      )}

      {/* Context */}
      {Array.isArray(analysis?.context_snippets) && analysis.context_snippets.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Context Insights</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {analysis.context_snippets.map((s, i) => (
              <li key={i} className="rounded-md border p-2 bg-gray-50">{s.text}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Ask box */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-2">Ask about this investor</h2>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-md px-3 py-2 text-sm"
            placeholder="e.g. What should I highlight when pitching?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={ask}
            disabled={busy}
            className="rounded-md px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {busy ? 'Thinking…' : 'Ask'}
          </button>
        </div>
        {answer && <pre className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{answer}</pre>}
      </Card>

      {/* === NEW: Notes / Suggested questions AFTER Ask section === */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-2">Notes & Suggested Questions</h2>
        <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
          {suggestedNotes.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          Tip: Click any note to copy it into the Ask box (coming soon).
        </p>
      </Card>
    </div>
  )
}
