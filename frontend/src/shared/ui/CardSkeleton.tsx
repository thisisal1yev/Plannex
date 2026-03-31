import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { Separator } from '@/shared/ui/primitives/separator'

export function CardSkeleton() {
  return (
    <div className="rounded-[14px] border border-border overflow-hidden flex flex-col">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="px-4 py-3.5 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Separator className="mt-1" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  )
}
