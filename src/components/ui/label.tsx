import * as React from 'react'
import { cn } from '@/lib/utils'
export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
return <label className={cn('text-sm text-zinc-700', props.className)} {...props} />
}