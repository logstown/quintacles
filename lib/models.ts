import { ListItem, MediaType, Network, Person, TvShowLite } from '@prisma/client'
import { TvEpisode } from './TmdbModels'

export type Genre = {
  id: number
  mediaTypes: MediaType[]
  name: string
  icon: React.ReactElement<any>
}

export type Year = {
  id: number
  name: string
}

export type RestrictionsUI = {
  mediaType: MediaType
  isLiveActionOnly?: boolean
  genreId?: number
  year?: number
  personId?: number | null
  Person?: Person | null
  episodesTvShowId?: number | null
  EpisodesTvShow?: TvShowLiteUI | null
  networkId?: number | null
  Network?: Network | null
}

export interface CreateListSearchParams {
  genreId?: string
  year?: string
  personId?: string
  isLiveActionOnly?: string
  episodesTvShowId?: string
  networkId?: string
}

export interface EpisodeData {
  allEpisodes: TvEpisode[]
  seasons: string[]
}

export interface TvShowLiteUI extends TvShowLite {
  seasons?: ListItem[]
}
