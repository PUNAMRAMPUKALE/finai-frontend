// src/features/recommend/StartupPitchSection.tsx
import * as React from 'react'
import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { API } from '@/lib/api/api'

type Match = Record<string, any>
type PitchResp = { matches: Match[] }

export default function StartupPitchSection({
  onMatches,
}: { onMatches?: (m: Match[]) => void }) {
  const [file, setFile] = React.useState<File | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const openPicker = () => inputRef.current?.click()

  async function upload() {
    if (!file) return setMsg('Please select a PDF first.')
    setBusy(true); setMsg(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await API.recommendPitchFile<PitchResp>(fd)
      onMatches?.(res.matches || [])
      setMsg('Uploaded. Showing matches below.')
    } catch (e) {
      setMsg((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f?.type === 'application/pdf') setFile(f)
  }

  return (
    <section
      className="rounded-[28px] border border-zinc-200 bg-white shadow-sm px-8 py-10"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-[36px] font-extrabold text-[#0b1220]">Upload your PDF</h2>
        <p className="mt-2 text-[15px] text-zinc-500">
          Client-side selection with a clean, minimal drop zone.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className="mt-8 rounded-[28px] px-8 py-10 border-2 border-dashed"
        style={{ borderColor: '#E5E7EB' }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <FileText className="h-7 w-7" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
              <Plus className="h-3 w-3" />
            </span>
          </div>

          <div className="text-[18px] font-medium text-[#0b1220]">
            Drag &amp; drop your PDF here
          </div>
          <div className="text-sm text-zinc-500 -mt-1">or</div>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <Button
            type="button"
            onClick={openPicker}
            className="rounded-2xl px-6 py-3 font-semibold shadow-card hover:shadow transition"
            style={{ background: '#4f46e5', color: '#fff' }}
          >
            Select PDF
          </Button>

          {file && (
            <div className="text-sm text-zinc-500 mt-1">
              Selected: <span className="font-medium text-zinc-800">{file.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Prompt row */}
      <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-3">
        <Button
          onClick={upload}
          disabled={busy || !file}
          className="h-14 rounded-2xl px-7 text-[15px] font-semibold shadow-card hover:shadow transition disabled:opacity-60"
          style={{ background: '#111827', color: '#fff' }}
        >
          {busy ? 'Analyzing…' : 'Analyze'}
        </Button>
      </div>

      {msg && <p className="mt-4 text-center text-sm text-zinc-500">{msg}</p>}
    </section>
  )
}