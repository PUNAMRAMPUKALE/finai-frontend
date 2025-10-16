import * as React from 'react'
import { cn } from '@/lib/utils'


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}


export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
return (
<input
className={cn(
'flex h-10 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-black',
className
)}
ref={ref}
{...props}
/>
)
})
Input.displayName = 'Input'