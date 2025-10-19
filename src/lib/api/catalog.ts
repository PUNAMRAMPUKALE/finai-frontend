import { API } from '@/lib/api/api'

export async function uploadCatalog(file: File) {
  const text = await file.text()
  const products = JSON.parse(text)
  const res = await API.ingestProductsJson<{ inserted: number }>({ products })
  return res
}
