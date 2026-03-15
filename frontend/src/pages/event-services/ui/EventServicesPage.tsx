import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '@entities/event'
import { servicesApi, BOOKING_STATUS_COLOR } from '@entities/service'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Modal } from '@shared/ui/Modal'
import { Spinner } from '@shared/ui/Spinner'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { eventKeys, serviceKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'

export function EventServicesPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [attachOpen, setAttachOpen] = useState(false)
  const [serviceId, setServiceId] = useState('')
  const [price, setPrice] = useState('')

  const { data: attached, isLoading } = useQuery({
    queryKey: eventKeys.services(id!),
    queryFn: () => eventsApi.services(id!),
    enabled: !!id,
  })

  const { data: allServices } = useQuery({
    queryKey: serviceKeys.allFlat(),
    queryFn: () => servicesApi.list({ limit: 100 }),
  })

  const attachMutation = useMutation({
    mutationFn: () => eventsApi.attachService(id!, { serviceId, agreedPrice: parseFloat(price) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.services(id!) })
      setAttachOpen(false)
    },
  })

  if (isLoading) return <Spinner />

  const serviceOptions = allServices?.data.map((s) => ({ value: s.id, label: `${s.name} — ${s.city}` })) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Tadbir xizmatlari</h1>
        <Button onClick={() => setAttachOpen(true)}>+ Xizmat qo'shish</Button>
      </div>

      <div className="flex flex-col gap-3">
        {attached?.map((es) => (
          <div key={es.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{es.service?.name}</p>
              <p className="text-sm text-muted-foreground">{es.service?.category}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-primary">{formatUZS(es.agreedPrice)}</span>
              <Badge color={BOOKING_STATUS_COLOR[es.status as keyof typeof BOOKING_STATUS_COLOR] ?? 'gray'}>
                {es.status}
              </Badge>
            </div>
          </div>
        ))}
        {attached?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Xizmatlar biriktirilmagan</p>
        )}
      </div>

      <Modal open={attachOpen} onClose={() => setAttachOpen(false)} title="Xizmat qo'shish">
        <div className="flex flex-col gap-4">
          <Select
            label="Xizmat"
            options={[{ value: '', label: 'Xizmatni tanlang' }, ...serviceOptions]}
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          />
          <Input label="Kelishilgan narx (so'm)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          {attachMutation.isError && <p className="text-sm text-destructive">Qo'shishda xatolik</p>}
          <Button
            onClick={() => attachMutation.mutate()}
            loading={attachMutation.isPending}
            disabled={!serviceId || !price}
          >
            Biriktirish
          </Button>
        </div>
      </Modal>
    </div>
  )
}
