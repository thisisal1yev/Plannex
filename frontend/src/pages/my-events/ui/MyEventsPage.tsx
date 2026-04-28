import { useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { MyEventCard } from '@entities/event'
import { useInfiniteMyEvents } from '@entities/event/model/event.infinite'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { Spinner } from '@shared/ui/Spinner'
import { Button } from '@shared/ui/Button'

export function MyEventsPage() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteMyEvents()

  const sentinelRef = useRef<HTMLDivElement>(null)
  const onIntersect = useCallback(() => { fetchNextPage() }, [fetchNextPage])
  useIntersectionObserver(sentinelRef, onIntersect, hasNextPage && !isFetchingNextPage)

  const events = data?.pages.flatMap((p) => p.data) ?? []

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Mening tadbirlarim</h1>
        <Link to="/my-events/create">
          <Button>+ Yaratish</Button>
        </Link>
      </div>

      {events.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Sizda hozircha tadbirlar yo'q</p>
          <Link to="/my-events/create"><Button>Birinchi tadbir yaratish</Button></Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event, index) => (
          <MyEventCard
            key={event.id}
            event={event}
            index={index}
          />
        ))}
      </div>

      {/* ── Infinite scroll sentinel ── */}
      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </div>
  )
}
