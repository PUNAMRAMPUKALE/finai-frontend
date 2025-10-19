const BASE = '/api'


export interface PitchRecommendResponse {
  mode: 'startup->investors'
  matches: Array<Record<string, any>>
  explanation?: string
}

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(msg || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const API = {
  // ingest
  ingestFile:   <T = unknown>(fd: FormData): Promise<T> =>
    http<T>('/v1/ingest/file', { method: 'POST', body: fd }),

  ingestProductsFile: <T = unknown>(fd: FormData): Promise<T> =>
    http<T>('/v1/ingest/products/file', { method: 'POST', body: fd }),

  ingest:       <T = unknown>(body: any): Promise<T> =>
    http<T>('/v1/ingest', { method: 'POST', body: JSON.stringify(body) }),

  ingestProductsJson: <T = unknown>(body: any): Promise<T> =>
    http<T>('/v1/ingest/products/json', { method: 'POST', body: JSON.stringify(body) }),

  // insights
  insights:     <T = unknown>(body: any): Promise<T> =>
    http<T>('/v1/insights', { method: 'POST', body: JSON.stringify(body) }),

  // recommend
  recommend:    <T = unknown>(body: any): Promise<T> =>
    http<T>('/v1/recommend', { method: 'POST', body: JSON.stringify(body) }),

  // profiles
  upsertProfile:<T = unknown>(body: any): Promise<T> =>
    http<T>('/v1/profiles', { method: 'POST', body: JSON.stringify(body) }),

  // graph
  graphSync:    <T = unknown>(): Promise<T> =>
    http<T>('/v1/graph/sync', { method: 'POST' }),

  graphQuery:   <T = unknown>(body: any): Promise<T> =>
    http<T>('/v1/graph/query', { method: 'POST', body: JSON.stringify(body) }),

  // crew
  crewAdvice:   <T = unknown>(body: any): Promise<T> =>
    http<T>('/v1/crew/advice', { method: 'POST', body: JSON.stringify(body) }),

  // (optional) startup PDF-specific helpers if you added those endpoints
  ingestStartupPdf: <T = unknown>(fd: FormData): Promise<T> =>
    http<T>('/v1/ingest/file', { method: 'POST', body: fd }),

  insightsStartup:  <T = unknown>(body: any): Promise<T> =>
    http<T>('/v1/insights', { method: 'POST', body: JSON.stringify(body) }),
recommendPitch: <T>(body: { text: string; meta?: Record<string, any>; top_n?: number; explain?: boolean }) =>
    http<T>('/v1/recommend/pitch', { method: 'POST', body: JSON.stringify(body) }),

  recommendPitchFile: async <T>(fd: FormData) => {
    // NOTE: do NOT set Content-Type; browser will set multipart boundary
    const res = await fetch(`${BASE}/v1/recommend/pitch/file`, { method: 'POST', body: fd })
    if (!res.ok) throw new Error(await res.text().catch(() => res.statusText))
    return res.json() as Promise<T>
  },
  
// recommendPitchFile: async <T>(fd: FormData) =>
//     http<T>('/v1/recommend/pitch/file', { method: 'POST', body: fd, headers: {} }),
  recommendPitchText: <T>(body: any) =>
    http<T>('/v1/recommend/pitch', { method: 'POST', body: JSON.stringify(body) }),

}

