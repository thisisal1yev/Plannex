import type { ReactNode } from 'react'

export interface TableColumn<T> {
  header: string
  render: (row: T, index: number) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  emptyMessage?: string
}

export function Table<T>({ columns, data, keyExtractor, emptyMessage = "Ma'lumot yo'q" }: TableProps<T>) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="text-left px-4 py-3 text-muted-foreground font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={keyExtractor(row)} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
              {columns.map((col, j) => (
                <td key={j} className={col.className ?? 'px-4 py-3 text-muted-foreground'}>
                  {col.render(row, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
      )}
    </div>
  )
}
