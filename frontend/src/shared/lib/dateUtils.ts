export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateLong(date: string | Date): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateDefault(date: string | Date): string {
  return new Date(date).toLocaleDateString('ru-RU')
}

export function formatUZS(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} млрд сум`
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} млн сум`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)} тыс сум`
  return `${amount} сум`
}
