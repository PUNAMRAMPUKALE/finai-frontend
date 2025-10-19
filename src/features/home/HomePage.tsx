import * as React from 'react'
import StartupPitchSection from '@/features/recommend/StartupPitchSection'

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* --- HEADER + INFO CARDS --- */}
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold">FinAI Console</h1>
        <p className="text-sm text-zinc-600">
          Run ingestion, ask insights, and get LLM-based recommendations.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl shadow-card p-5 card-blue">
            <div className="text-sm font-semibold text-blue-900">Ingest</div>
            <div className="text-xs text-blue-900/70 mt-1">
              Load PDFs and store vector chunks.
            </div>
          </div>
          <div className="rounded-2xl shadow-card p-5 card-pink">
            <div className="text-sm font-semibold text-pink-900">Insights</div>
            <div className="text-xs text-pink-900/70 mt-1">
              Ask questions backed by your docs.
            </div>
          </div>
          <div className="rounded-2xl shadow-card p-5 card-green">
            <div className="text-sm font-semibold text-emerald-900">
              Recommendations
            </div>
            <div className="text-xs text-emerald-900/70 mt-1">
              LLM-selected ETFs/products per profile.
            </div>
          </div>
          <div className="rounded-2xl shadow-card p-5 card-amber">
            <div className="text-sm font-semibold text-amber-900">
              Knowledge Graph
            </div>
            <div className="text-xs text-amber-900/70 mt-1">
              Build and query a tiny KG from chunks.
            </div>
          </div>
        </div>
      </section>

      {/* --- Startup Funding Match Section --- */}
      <section className="pt-6 border-t app-border">
        <h2 className="text-xl font-semibold mb-4">Startup Funding Match</h2>
        <p className="text-sm text-zinc-600 mb-6">
          Upload your startup presentation (PDF) and discover top matching investors automatically.
        </p>

        <StartupPitchSection />
      </section>
    </div>
  )
}