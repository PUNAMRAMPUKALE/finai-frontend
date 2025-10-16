import * as React from 'react'
import { cn } from '@/lib/utils'


export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
return <div className={cn('rounded-2xl bg-white shadow-card border border-zinc-100', className)} {...props} />
}
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
return <div className={cn('p-4 border-b border-zinc-100', className)} {...props} />
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
return <div className={cn('p-4', className)} {...props} />
}