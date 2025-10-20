import * as React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7fb]">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
