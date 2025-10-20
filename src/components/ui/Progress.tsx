export function Progress({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="w-full h-2 rounded-full bg-surface-200 overflow-hidden border app-border">
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#5C79FF,#90A6FF)' }}
      />
    </div>
  )
}