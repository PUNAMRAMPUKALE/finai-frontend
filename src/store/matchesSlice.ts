// src/store/matchesSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Match = {
  name?: string
  thesis?: string
  sectors?: string | string[]
  stages?: string | string[]
  geo?: string
  region?: string
  checkSize?: string
  score?: number
  score_pct?: number
  distance?: number
}

type MatchesState = {
  list: Match[]
  lastPitchQuery?: string
}

const initialState: MatchesState = {
  list: [],
  lastPitchQuery: undefined,
}

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches(state, action: PayloadAction<Match[]>) {
      state.list = action.payload ?? []
    },
    clearMatches(state) {
      state.list = []
      state.lastPitchQuery = undefined
    },
    setLastPitchQuery(state, action: PayloadAction<string | undefined>) {
      state.lastPitchQuery = action.payload
    },
  },
})

export const { setMatches, clearMatches, setLastPitchQuery } = matchesSlice.actions
export default matchesSlice.reducer
