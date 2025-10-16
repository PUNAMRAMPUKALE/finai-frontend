export type IngestDoc = { title: string; source?: string; text?: string; file_path?: string }
export type IngestResponse = { inserted: number }


export type InsightRequest = { question: string; top_k?: number }
export type InsightResponse = { answer: string; sources: string[] }


export type Profile = {
profile_id: string
goal: string
horizon_years: number
risk: string
preferences: string[]
constraints: string[]
}


export type RecommendReq = { profile: Partial<{
goal: string; risk: string; horizon_years: number; preferences: string[]; constraints: string[];
riskTolerance: string; investmentGoal: string; horizonYears: number;
}> }


export type RecommendResp = { status: 'ok'; products: { id: string; name: string; why: string; score: number }[]; explanation: string }