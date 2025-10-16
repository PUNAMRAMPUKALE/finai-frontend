import { cn } from '@/lib/utils'

export type ResultItem = { title: string; body: string; tag?: string }

export function ResultCard({ item, className }: { item: ResultItem; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4',
        'app-card app-border',
        className
      )}
    >
      <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
        {item.tag ?? 'Result'}
      </div>
      <div className="mt-1 font-semibold app-text">{item.title}</div>
      <p className="mt-2 text-sm app-muted whitespace-pre-wrap">{item.body}</p>
    </div>
  )
}

export function ResultsGrid({ items }: { items: ResultItem[] }) {
  if (!items?.length) return null
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => <ResultCard key={i} item={it} />)}
    </div>
  )
}
