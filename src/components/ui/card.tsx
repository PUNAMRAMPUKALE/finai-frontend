import * as React from 'react'
import { cn } from '@/lib/utils'

export function Card({
  className, children, hover = true,
}: { className?: string; children: React.ReactNode; hover?: boolean }) {
  return (
    <div
      className={cn(
        'app-card border app-border rounded-2xl shadow-card transition-all',
        hover && 'hover:shadow-glow hover:-translate-y-[1px]',
        'card-shine', // fancy sheen
        className
      )}
    >
      {children}
    </div>
  )
}