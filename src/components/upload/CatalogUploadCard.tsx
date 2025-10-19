import * as React from 'react'
import { Database, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { API } from '@/lib/api/api'
import { uploadCatalogFile } from '@/lib/api/uploads'

type Props = {
  useServerUpload?: boolean // false = send JSON; true = upload file
}

export default function CatalogUploadCard({ useServerUpload = false }: Props) {
  const [file, setFile] = React.useState<File | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)
  const [inserted, setInserted] = React.useState<number | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const openFileDialog = () => fileInputRef.current?.click()

  async function doUpload() {
    if (!file) return setMsg('Please select a catalog JSON file.')
    setBusy(true)
    setMsg(null)
    setInserted(null)

    try {
      const res = await uploadCatalogFile(file)

      const count = (res as any).inserted ?? 0
      setInserted(count)
      setMsg(`✅ ${count} products uploaded successfully.`)
    } catch (err) {
      setMsg(`❌ ${(err as Error).message}`)
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
        <h1 className="text-xl font-semibold app-text">Upload Product Catalog</h1>
        <p className="mt-1 text-sm app-muted">
          Upload your ETF or product catalog JSON to index products in Weaviate.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className="mt-6 rounded-2xl border-2 border-dashed border-gray-300 p-7 text-center transition hover:border-[var(--accent)]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const f = e.dataTransfer.files?.[0]
          if (f) setFile(f)
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative flex h-12 w-12 items-center justify-center rounded-xl text-[var(--accent)] bg-[var(--accent-50)]"
          >
            <Database className="h-6 w-6" />
          </div>

          <div className="text-sm app-text font-medium">Drag & drop your catalog.json</div>
          <div className="text-xs app-muted -mt-1">or</div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <Button
            type="button"
            onClick={openFileDialog}
            className="rounded-xl px-4 py-2 font-medium shadow-sm hover:shadow transition"
            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
            disabled={busy}
          >
            {busy ? 'Uploading…' : (
              <>
                <Upload className="inline-block mr-1 h-4 w-4" />
                Choose File
              </>
            )}
          </Button>

          {file && (
            <div className="text-xs app-muted mt-1">
              Selected: <span className="font-medium app-text">{file.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload button */}
      <div className="mt-5 flex justify-center">
        <Button
          onClick={doUpload}
          disabled={busy}
          className="rounded-xl px-6 py-2 font-medium text-white shadow-sm hover:shadow transition"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          {busy ? 'Processing…' : 'Upload Catalog'}
        </Button>
      </div>

      {msg && (
        <div className="mt-3 text-center text-sm app-muted">
          {msg}
        </div>
      )}
    </section>
  )
}