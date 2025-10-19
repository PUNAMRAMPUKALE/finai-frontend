import { API } from '@/lib/api/api'

export async function uploadPdfToServer(
  file: File,
  { title, source }: { title: string; source?: string }
) {
  const fd = new FormData()
  fd.append('title', title)
  fd.append('source', source ?? 'upload')
  fd.append('file', file)
  const res = await API.ingestFile<{ inserted: number }>(fd)
  return res
}

export async function uploadCatalogFile(file: File) {
  const fd = new FormData()
  fd.append('file', file) // JSON file
  const res = await API.ingestProductsFile<{ inserted: number }>(fd)
  return res
}