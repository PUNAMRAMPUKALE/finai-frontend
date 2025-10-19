// src/components/upload/PdfUploadHero.tsx
import * as React from 'react'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { extractTextFromPdf } from '@/lib/pdf'
import { API } from '@/lib/api/api'
import type { ResultItem } from '@/components/cards/ResultCard'
import type { IngestResponse, InsightsResponse } from '@/lib/types'

type Mode = 'default' | 'upload-only'

type Props = {
  // Existing behavior
  enableAnalyze?: boolean
  defaultQuestion?: string
  onIngest?: (inserted: number) => void
  onAnalyzeResults?: (items: ResultItem[]) => void

  // New overrides to reuse UI as a generic PDF uploader
  mode?: Mode
  submitLabel?: string
  onSubmit?: (file: File) => Promise<void>
}

export default function PdfUploadHero({
  // default behavior (kept)
  enableAnalyze = true,
  defaultQuestion = 'Summarize key metrics and risks',
  onIngest,
  onAnalyzeResults,

  // new props
  mode = 'default',
  submitLabel = 'Upload',
  onSubmit,
}: Props) {
  const [title, setTitle] = React.useState('Document')
  const [source, setSource] = React.useState('upload')
  const [file, setFile] = React.useState<File | null>(null)
  const [question, setQuestion] = React.useState(defaultQuestion)
  const [dragOver, setDragOver] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const openFileDialog = () => fileInputRef.current?.click()

  // ---- Default ingest+analyze flows (unchanged) ----
  async function doIngest() {
    if (!file) return setMsg('Select a PDF first.')
    setBusy(true); setMsg(null)
    try {
      const text = await extractTextFromPdf(file)
      const res = await API.ingest<IngestResponse>({ title, source, text })
      setMsg(`Inserted ${res.inserted} chunks.`)
      onIngest?.(res.inserted)
    } catch (e) {
      setMsg((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  async function doAnalyze() {
    if (!enableAnalyze) return
    setBusy(true); setMsg(null)
    try {
      const res = await API.insights<InsightsResponse>({ question, top_k: 5 })
      const items: ResultItem[] = [
        { title: 'Answer', body: res.answer, tag: 'Insights' },
        ...res.sources.map((s, i) => ({ title: `Source ${i + 1}`, body: s, tag: 'Source' })),
      ]
      onAnalyzeResults?.(items)
      setMsg('Analysis complete.')
    } catch (e) {
      setMsg((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  // ---- Upload-only flow (used by StartupPitchSection) ----
  async function doSubmitUploadOnly() {
    if (!file) return setMsg('Select a PDF first.')
    if (!onSubmit) return
    setBusy(true); setMsg(null)
    try {
      await onSubmit(file)
      setMsg('Uploaded.')
    } catch (e) {
      setMsg((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section
      className="rounded-3xl border app-border app-card px-6 py-8"
      style={{ background: 'var(--surface)' }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-semibold app-text">
          {mode === 'upload-only' ? 'Upload your PDF' : 'Upload a PDF for instant analysis'}
        </h1>
        <p className="mt-2 text-sm app-muted">
          {mode === 'upload-only'
            ? 'Client-side selection with a clean, minimal drop zone.'
            : 'Client-side text extraction, vector ingest, then optional AI analysis.'}
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={[
          'mt-6 rounded-2xl border-2 border-dashed p-7 transition-colors',
          dragOver ? 'bg-[var(--accent-50)]' : 'bg-white'
        ].join(' ')}
        style={{ borderColor: 'var(--border)' }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false)
          const f = e.dataTransfer.files?.[0]
          if (f && f.type === 'application/pdf') setFile(f)
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: 'var(--accent-50)', color: 'var(--accent)' }}
          >
            <FileText className="h-6 w-6" />
            <span
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px]"
              style={{ background: 'var(--accent)' }}
            >
              <Plus className="h-3 w-3" />
            </span>
          </div>

          <div className="text-sm app-text font-medium">Drag & drop your PDF here</div>
          <div className="text-xs app-muted -mt-1">or</div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
          />
          <Button
            type="button"
            onClick={openFileDialog}
            className="rounded-xl px-4 py-2 font-medium shadow-sm hover:shadow transition"
            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
          >
            Select PDF
          </Button>

          {file && (
            <div className="text-xs app-muted mt-1">
              Selected: <span className="font-medium app-text">{file.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Meta + Actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Left column: meta (only for default mode) */}
        {mode === 'default' && (
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
            <Label>Source</Label>
            <Input value={source} onChange={e => setSource(e.target.value)} />
          </div>
        )}

        {/* Right column: actions */}
        <div className="space-y-2">
          {mode === 'default' && enableAnalyze && (
            <>
              <Label>Quick question</Label>
              <Input value={question} onChange={e => setQuestion(e.target.value)} />
            </>
          )}

          <div className="flex gap-3 pt-2">
            {mode === 'upload-only' ? (
              <Button
                onClick={doSubmitUploadOnly}
                disabled={busy}
                className="rounded-xl px-4 py-2 font-medium text-white shadow-sm hover:shadow transition"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {busy ? 'Uploading…' : submitLabel}
              </Button>
            ) : (
              <>
                <Button
                  onClick={doIngest}
                  disabled={busy}
                  className="rounded-xl px-4 py-2 font-medium text-white shadow-sm hover:shadow transition"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {busy ? 'Uploading…' : 'Upload'}
                </Button>

                {enableAnalyze && (
                  <Button
                    onClick={doAnalyze}
                    disabled={busy}
                    variant="outline"
                    className="rounded-xl px-4 py-2 font-medium border app-border hover:bg-[var(--accent-50)]"
                  >
                    {busy ? 'Analyzing…' : 'Analyze'}
                  </Button>
                )}
              </>
            )}
          </div>

          {msg && <div className="text-xs app-muted pt-1">{msg}</div>}
        </div>
      </div>
    </section>
  )
}