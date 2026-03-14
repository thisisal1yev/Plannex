export const eventKeys = {
  all: () => ['events'] as const,
  list: (params: object) => ['events', params] as const,
  detail: (id: string) => ['event', id] as const,
  myList: () => ['my-events'] as const,
  reviews: (id: string) => ['event-reviews', id] as const,
  services: (id: string) => ['event-services', id] as const,
  participants: (id: string) => ['event-participants', id] as const,
  volunteers: (id: string) => ['event-volunteers', id] as const,
}

export const venueKeys = {
  all: () => ['venues'] as const,
  list: (params: object) => ['venues', params] as const,
  detail: (id: string) => ['venue', id] as const,
  myList: () => ['my-venues'] as const,
  reviews: (id: string) => ['venue-reviews', id] as const,
}

export const serviceKeys = {
  all: () => ['services'] as const,
  list: (params: object) => ['services', params] as const,
  allFlat: () => ['services-all'] as const,
  detail: (id: string) => ['service', id] as const,
  myList: () => ['my-services'] as const,
  reviews: (id: string) => ['service-reviews', id] as const,
}

export const userKeys = {
  all: () => ['users'] as const,
  list: (params: object) => ['users', params] as const,
  me: () => ['me'] as const,
}

export const ticketKeys = {
  myList: () => ['my-tickets'] as const,
  detail: (id: string) => ['ticket', id] as const,
}

export const analyticsKeys = {
  dashboard: () => ['dashboard'] as const,
}
