import * as React from 'react'
export function Carousel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 snap-x snap-mandatory">
        {React.Children.map(children, (c, i) => (
          <div className="snap-start shrink-0 w-[320px]">{c}</div>
        ))}
      </div>
    </div>
  )
}