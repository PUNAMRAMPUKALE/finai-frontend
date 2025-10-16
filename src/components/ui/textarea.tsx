import * as React from 'react'
import { cn } from '@/lib/utils'


export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}


export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
return (
<textarea
className={cn(
'flex min-h-[120px] w-full rounded-2xl border border-zinc-200 bg-white p-4 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-black',
className
)}
ref={ref}
{...props}
/>
)
})
Textarea.displayName = 'Textarea'