import * as React from 'react'
import { RouterProvider, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import { Layout } from './layout'
import HomePage from '@/features/home/HomePage'
import IngestPage from '@/features/ingest/IngestPage'
import InsightsPage from '@/features/insights/InsightsPage'
import RecommendPage from '@/features/recommend/RecommendPage'
import ProfilePage from '@/features/profiles/ProfilePage'
import GraphPage from '@/features/graph/GraphPage'
import CrewPage from '@/features/crew/CrewPage'


const rootRoute = createRootRoute({
component: () => (
<QueryClientProvider client={queryClient}>
<Layout />
</QueryClientProvider>
)
})


const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage })
const ingestRoute = createRoute({ getParentRoute: () => rootRoute, path: '/ingest', component: IngestPage })
const insightsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/insights', component: InsightsPage })
const recommendRoute = createRoute({ getParentRoute: () => rootRoute, path: '/recommend', component: RecommendPage })
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/profiles', component: ProfilePage })
const graphRoute = createRoute({ getParentRoute: () => rootRoute, path: '/graph', component: GraphPage })
const crewRoute = createRoute({ getParentRoute: () => rootRoute, path: '/crew', component: CrewPage })


const routeTree = rootRoute.addChildren([
indexRoute, ingestRoute, insightsRoute, recommendRoute, profileRoute, graphRoute, crewRoute
])


export const router = createRouter({ routeTree })


export default function AppRouter() {
return <RouterProvider router={router} />
}