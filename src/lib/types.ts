// Ingest
export type IngestRequest = { title: string; source?: string; text?: string; file_path?: string }
export type IngestResponse = { inserted: number }

// Insights (RAG)
export type InsightsRequest = { question: string; top_k?: number }
export type InsightsResponse = { answer: string; sources: string[] }

// Recommend (LLM-based)
export type Profile = {
  goal: string
  risk: string
  horizon_years: number
  preferences: string[]
  constraints: string[]
}

export type RecommendRequest = { profile: Profile }
export type ProductRow = { id?: string; name: string; why?: string; score?: number } & Record<string, any>
// Profiles
export type UpsertProfileRequest = {
  profile_id: string
  goal: string
  horizon_years: number
  risk: string
  preferences?: string[]
  constraints?: string[]
}
export type UpsertProfileResponse = { status: 'ok'; profile_id: string }

// Graph
export type GraphSyncResponse = { inserted: number }
export type CypherRequest = { query: string; params?: Record<string, any> }
export type CypherResponse = { rows: Record<string, any>[] }

// Crew
export type CrewAdviceRequest = {
  question: string
  profile: Record<string, any>
}
export type CrewAdviceResponse = {
  research?: string | null
  product_match?: string | null
  crew_summary?: string | null
}

export type RecommendResponse = {
  mode: 'profile->products' | 'startup->investors' | 'investor->startups'
  products?: Array<any>
  matches?: Array<any>
  explanation?: string
}

