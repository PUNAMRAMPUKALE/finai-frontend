import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { extractTextFromPdf } from '@/lib/pdf'
import { API } from '@/lib/api'

export default function RightPanel() {
  const [title, setTitle] = React.useState('Quick Upload')
  const [source, setSource] = React.useState('upload')
  const [file, setFile] = React.useState<File | null>(null)

  const ingest = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('Choose a PDF file')
      const text = await extractTextFromPdf(file)
      return API.ingest({ title, source, text })
    },
  })

  return (
    <aside className="sticky top-20 space-y-4">
      <div className="rounded-2xl glass shadow-card">
        <div className="border-b border-zinc-200 p-4">
          <div className="text-sm font-semibold">Quick Ingest</div>
          <div className="text-xs text-zinc-500">Upload a PDF → store vectors (no server file-paths needed)</div>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Source</Label>
            <Input value={source} onChange={e => setSource(e.target.value)} />
          </div>
          <div>
            <Label>PDF file</Label>
            <Input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <Button onClick={() => ingest.mutate()} disabled={ingest.isPending}>
            {ingest.isPending ? 'Uploading…' : 'Upload & Ingest'}
          </Button>
          {ingest.isSuccess && (
            <div className="text-xs text-green-600">Inserted: {(ingest.data as any).inserted}</div>
          )}
          {ingest.isError && <div className="text-xs text-red-600">{(ingest.error as Error).message}</div>}
        </div>
      </div>

      <div className="rounded-2xl glass shadow-card p-4">
        <div className="text-sm font-semibold">Shortcuts</div>
        <ul className="mt-2 text-sm text-zinc-700 space-y-2 list-disc list-inside">
          <li>Ask Insights on your latest upload</li>
          <li>Run LLM-based Recommendations</li>
          <li>Sync Knowledge Graph</li>
        </ul>
      </div>
    </aside>
  )
}
