import { MediaType, Person, Restrictions, TvShowLite } from '@prisma/client'

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

export type RestrictionsUI = {
  mediaType: MediaType
  isLiveActionOnly?: boolean
  genreId?: number
  decade?: number
  personId?: number
  Person?: Person
  episodesTvShowId?: number
  EpisodesTvShow?: TvShowLite
}

export interface CreateListSearchParams {
  genreId?: string
  decade?: string
  personId?: string
  isLiveActionOnly?: string
  episodesTvShowId?: string
}
