import { flexRender } from '@tanstack/react-table'
import type { Table as RTTable } from '@tanstack/react-table'


export function DataTable<T>({ table }: { table: RTTable<T> }) {
return (
<div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-card">
<table className="w-full text-sm">
<thead className="bg-zinc-50">
{table.getHeaderGroups().map(hg => (
<tr key={hg.id}>
{hg.headers.map(h => (
<th key={h.id} className="px-4 py-3 text-left font-medium text-zinc-700">
{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
</th>
))}
</tr>
))}
</thead>
<tbody>
{table.getRowModel().rows.map(row => (
<tr key={row.id} className="border-t border-zinc-100">
{row.getVisibleCells().map(cell => (
<td key={cell.id} className="px-4 py-3">
{flexRender(cell.column.columnDef.cell, cell.getContext())}
</td>
))}
</tr>
))}
</tbody>
</table>
</div>
)
}