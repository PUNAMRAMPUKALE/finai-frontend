import * as React from 'react'
import { FileText, Plus } from 'lucide-react'        // ⬅️ new, minimal icons
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { extractTextFromPdf } from '@/lib/pdf'
import { API } from '@/lib/api'
import type { ResultItem } from '@/components/cards/ResultCard'

type Props = {
  enableAnalyze?: boolean
  defaultQuestion?: string
  onIngest?: (inserted: number) => void
  onAnalyzeResults?: (items: ResultItem[]) => void
}

export default function PdfUploadHero({
  enableAnalyze = true,
  defaultQuestion = 'Summarize key metrics and risks',
  onIngest,
  onAnalyzeResults,
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

  async function doIngest() {
    if (!file) return setMsg('Select a PDF first.')
    setBusy(true); setMsg(null)
    try {
      const text = await extractTextFromPdf(file)
      const res = await API.ingest({ title, source, text }) as { inserted: number }
      setMsg(`Inserted ${res.inserted} chunks.`)
      onIngest?.(res.inserted)
    } catch (e) { setMsg((e as Error).message) }
    finally { setBusy(false) }
  }

  async function doAnalyze() {
    if (!enableAnalyze) return
    setBusy(true); setMsg(null)
    try {
      const res = await API.insights({ question, top_k: 5 }) as { answer: string; sources: string[] }
      const items: ResultItem[] = [
        { title: 'Answer', body: res.answer, tag: 'Insights' },
        ...res.sources.map((s, i) => ({ title: `Source ${i + 1}`, body: s, tag: 'Source' })),
      ]
      onAnalyzeResults?.(items)
      setMsg('Analysis complete.')
    } catch (e) { setMsg((e as Error).message) }
    finally { setBusy(false) }
  }

  return (
    <section
      className="rounded-3xl border app-border app-card px-6 py-8"
      style={{ background: 'var(--surface)' }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-semibold app-text">Upload a PDF for instant analysis</h1>
        <p className="mt-2 text-sm app-muted">
          Client-side text extraction, vector ingest, then optional AI analysis.
        </p>
      </div>

      {/* --- Minimal, premium drop zone with styled Select button --- */}
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
          {/* Icon: document + small plus badge */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl"
               style={{ background: 'var(--accent-50)', color: 'var(--accent)' }}>
            <FileText className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px]"
                  style={{ background: 'var(--accent)' }}>
              <Plus className="h-3 w-3" />
            </span>
          </div>

          <div className="text-sm app-text font-medium">Drag & drop your PDF here</div>
          <div className="text-xs app-muted -mt-1">or</div>

          {/* Styled “Select PDF” button (hidden input) */}
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

          {/* Selected file name (subtle) */}
          {file && (
            <div className="text-xs app-muted mt-1">
              Selected: <span className="font-medium app-text">{file.name}</span>
            </div>
          )}
        </div>
      </div>
      {/* --- end drop zone --- */}

      {/* Meta + Actions */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={title} onChange={e => setTitle(e.target.value)} />
          <Label>Source</Label>
          <Input value={source} onChange={e => setSource(e.target.value)} />
        </div>

        <div className="space-y-2">
          {enableAnalyze && (
            <>
              <Label>Quick question</Label>
              <Input value={question} onChange={e => setQuestion(e.target.value)} />
            </>
          )}

          <div className="flex gap-3 pt-2">
            {/* Primary */}
            <Button
              onClick={doIngest}
              disabled={busy}
              className="rounded-xl px-4 py-2 font-medium text-white shadow-sm hover:shadow transition"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {busy ? 'Uploading…' : 'Upload'}
            </Button>

            {/* Secondary */}
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
          </div>

          {msg && <div className="text-xs app-muted pt-1">{msg}</div>}
        </div>
      </div>
    </section>
  )
}