const BASE = '/api/v1'


async function j<T>(res: Response): Promise<T> {
if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
return res.json() as Promise<T>
}


export const API = {
ingest: (doc: import('./types').IngestDoc) => fetch(`${BASE}/ingest`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc) }).then(j),
insights: (body: import('./types').InsightRequest) => fetch(`${BASE}/insights`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(j),
recommend: (body: import('./types').RecommendReq) => fetch(`${BASE}/recommend`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(j),
profileUpsert: (p: import('./types').Profile) => fetch(`${BASE}/profiles`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) }).then(j),
graphSync: (max_docs = 200) => fetch(`${BASE}/graph/sync?max_docs=${max_docs}`, { method: 'POST' }).then(j),
graphQuery: (q: string) => fetch(`${BASE}/graph/query`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }) }).then(j)
}