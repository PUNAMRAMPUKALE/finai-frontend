import * as React from 'react'
import { Link } from '@tanstack/react-router'


const items = [
{ to: '/', label: 'Home' },
{ to: '/ingest', label: 'Ingest' },
{ to: '/insights', label: 'Insights' },
{ to: '/recommend', label: 'Recommend' },
{ to: '/profiles', label: 'Profiles' },
{ to: '/graph', label: 'Graph' },
{ to: '/crew', label: 'Crew' }
]


export function MainNav() {
return (
<header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/70 backdrop-blur">
<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
<div className="text-lg font-semibold">FinAI</div>
<nav className="flex gap-3 text-sm">
{items.map(i => (
<Link key={i.to} to={i.to} className="rounded-xl px-3 py-2 hover:bg-zinc-100" activeProps={{ className: 'bg-zinc-900 text-white' }}>
{i.label}
</Link>
))}
</nav>
</div>
</header>
)
}