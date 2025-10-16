// BEFORE
// import RightPanel from '@/components/layout/RightPanel'

import * as React from 'react'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { MainNav } from '@/components/nav/MainNav'
import Footer from '@/components/layout/Footer'

export function Layout() {
  const state = useRouterState()
  return (
    <div className="min-h-screen app-bg">
      <MainNav />

      {/* BEFORE: grid with right column */}
      {/* <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <Outlet />
        </section>
        <section className="hidden lg:block">
          <RightPanel />
        </section>
      </main> */}

      {/* AFTER: single column */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>

      <div className="py-2 text-center text-[10px] text-zinc-400">Route: {state.location.pathname}</div>
      <Footer />
    </div>
  )
}
