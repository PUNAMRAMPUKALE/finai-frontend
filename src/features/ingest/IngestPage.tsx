import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { API } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function IngestPage() {
const [title, setTitle] = React.useState('APAC Factsheet')
const [filePath, setFilePath] = React.useState('data/samples/ETF_APAC_Factsheet.pdf')
const [source, setSource] = React.useState('factsheet')


const m = useMutation({
mutationFn: () => API.ingest({ title, file_path: filePath, source }),
})


return (
<div className="grid gap-4 max-w-xl">
<h2 className="text-xl font-semibold">Ingest PDF → Weaviate</h2>
<div className="grid gap-2">
<Label>Title</Label>
<Input value={title} onChange={e => setTitle(e.target.value)} />
<Label>File Path</Label>
<Input value={filePath} onChange={e => setFilePath(e.target.value)} />
<Label>Source</Label>
<Input value={source} onChange={e => setSource(e.target.value)} />
</div>
<Button onClick={() => m.mutate()} disabled={m.isPending}>{m.isPending ? 'Ingesting…' : 'Ingest'}</Button>
{m.isSuccess && <p className="text-sm text-green-600">Inserted: {(m.data as any).inserted}</p>}
{m.isError && <p className="text-sm text-red-600">{(m.error as Error).message}</p>}
</div>
)
}