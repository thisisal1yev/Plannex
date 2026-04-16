import type { VolunteerStatus } from '@shared/types'
import type { User } from '../../user/model/types'
import type { Event } from '../../event/model/types'

export interface VolunteerSkill {
  id: string
  name: string
}

export interface VolunteerApplication {
  id: string
  userId: string
  user?: User
  eventId: string
  event?: Event
  skillId: string          // was: skills: string[]
  skill?: VolunteerSkill   // populated when backend includes the relation
  status: VolunteerStatus
  createdAt: string
}
