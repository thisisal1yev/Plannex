import { LoaderCircle } from 'lucide-react'

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center py-8 ${className}`}>
      <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
