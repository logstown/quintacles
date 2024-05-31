import { ListItem, MediaType, Person, Restrictions } from '@prisma/client'

export type Genre = {
  id: number
  mediaTypes: MediaType[]
  name: string
  icon: React.ReactElement
}

export type Decade = {
  id: number
  name: string
}

export type RestrictionsUI = Omit<Restrictions, 'id'> & {
  Person?: Person
  EpisodesTvShow?: ListItem
}
