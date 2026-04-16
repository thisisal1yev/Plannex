import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { volunteersApi } from '@entities/volunteer'
import { Button } from '@shared/ui/Button'

// Seeded volunteer skills from backend/prisma/constants.ts
// In production these should come from a GET /volunteer-skills endpoint
const SKILL_OPTIONS = [
  'registration', 'guest greeting', 'info desk', 'translation',
  'badge scanning', 'crowd control', 'tech support', 'live streaming',
  'speaker coordination', 'stage management', 'artist coordination',
  'audio monitoring', 'lighting assistance', 'coordination', 'scheduling',
  'design review', 'feedback collection', 'art installation',
  'visitor guidance', 'art curation', 'multilingual support',
]

interface ApplyVolunteerFormProps {
  eventId: string
  onSuccess?: () => void
}

const selectCls =
  'h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring text-foreground'

export function ApplyVolunteerForm({ eventId, onSuccess }: ApplyVolunteerFormProps) {
  const [skillId, setSkillId] = useState('')

  const mutation = useMutation({
    mutationFn: () => volunteersApi.apply(eventId, skillId),
    onSuccess,
  })

  return (
    <div className="flex flex-col gap-4">
      <select
        value={skillId}
        onChange={(e) => setSkillId(e.target.value)}
        className={selectCls}
      >
        <option value="">Ko'nikma tanlang</option>
        {SKILL_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {mutation.isError && <p className="text-sm text-destructive">Ariza topshirishda xatolik</p>}
      {mutation.isSuccess && <p className="text-sm text-green-500 dark:text-green-400">Ariza topshirildi!</p>}
      <Button
        onClick={() => mutation.mutate()}
        loading={mutation.isPending}
        disabled={!skillId}
        className="w-full"
      >
        Ko'ngilli ariza topshirish
      </Button>
    </div>
  )
}
