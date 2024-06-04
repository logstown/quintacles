import { range, reject } from 'lodash'
import { Decade, RestrictionsUI } from './models'
import { ListItem, MediaType } from '@prisma/client'
import { mediaTypes } from './mediaTypes'
import { getTvSeason } from './TmdbService'
import { Season, TvEpisode } from './TmdbModels'
import { flow, map, sortBy, uniq } from 'lodash/fp'

export const getUserListsUrl = (
  {
    genreId,
    decade,
    isLiveActionOnly,
    personId,
    episodesTvShowId,
    mediaType,
  }: RestrictionsUI,
  page: 'build' | 'explore' = 'build',
): string => {
  const baseUrl =
    page == 'build'
      ? `/create/list/${mediaTypes[mediaType].urlPlural}?`
      : `/explore/${mediaTypes[mediaType].urlPlural}?`

  // const restrictionsAsStrings = mapValues(restrictions, x => x?.toString())
  // const params = pickBy(restrictionsAsStrings, x => !!x)

  const params = {} as any

  if (genreId) {
    params.genreId = genreId.toString()
  }
  if (decade) {
    params.decade = decade.toString()
  }
  if (isLiveActionOnly) {
    params.isLiveActionOnly = 'true'
  }
  if (personId) {
    params.moviePersonId = personId.toString()
  }
  if (episodesTvShowId) {
    params.episodesTvShowId = episodesTvShowId.toString()
  }

  if (page == 'explore') {
    params.exactMatch = 'true'
  }

  return baseUrl + new URLSearchParams(params as Record<string, string>)
}

export const getDecades = (): Decade[] => {
  return range(1930, 2030, 10)
    .reverse()
    .map(x => ({ id: x, name: `${x}s` }))
}

export const getTmdbImageUrl = (
  path?: string | null,
  size?: string,
): string => {
  if (!path) {
    return ''
  }
  return `https://image.tmdb.org/t/p/${size ?? 'w300'}${path}`
}

export const convertMediaItem = (
  {
    id,
    overview,
    title,
    name,
    poster_path,
    profile_path,
    release_date,
    first_air_date,
    air_date,
    still_path,
    season_number,
    episode_number,
    backdrop_path,
    genre_ids,
  }: any,
  mediaType: MediaType,
): ListItem => {
  let listItem = {
    id: `${mediaType}-${id}`,
    mediaType,
  } as ListItem

  switch (mediaType) {
    case MediaType.Movie:
      listItem = {
        ...listItem,
        name: title,
        posterPath: poster_path,
        date: release_date,
        backdropPath: backdrop_path,
        overview,
      } as ListItem
      break
    case MediaType.TvShow:
      listItem = {
        ...listItem,
        name,
        posterPath: poster_path,
        date: first_air_date,
        backdropPath: backdrop_path,
        overview,
      } as ListItem
      break
    case MediaType.TvEpisode:
      listItem = {
        ...listItem,
        name,
        date: air_date,
        backdropPath: still_path,
        seasonNum: season_number,
        episodeNum: episode_number,
        overview,
      } as ListItem
      break
    case MediaType.Person:
      listItem = {
        ...listItem,
        name,
        posterPath: profile_path,
      }
      break
  }

  if (genre_ids) {
    listItem.genreIds = genre_ids
  }

  return listItem
}

const fetchAllEpisodes = async (
  showId: number,
  seasonNum: number,
): Promise<TvEpisode[]> => {
  const season = (await getTvSeason(showId, seasonNum)) as Season & {
    success: boolean
  }

  if (season.success === false) {
    return []
  } else {
    const episodes = reject(
      season.episodes,
      ep => new Date(ep.air_date) > new Date(),
    )
    const nextSeasonEps = await fetchAllEpisodes(showId, seasonNum + 1)
    return [...episodes, ...nextSeasonEps]
  }
}

export interface EpisodeData {
  allEpisodes: TvEpisode[]
  seasons: string[]
}

export const getEpisodeData = async (
  tvShowId: number,
): Promise<EpisodeData> => {
  const allEpisodes = await fetchAllEpisodes(tvShowId, 1)
  const seasons = flow(
    map('season_number'),
    map(x => x.toString()),
    uniq,
    sortBy(x => Number(x)),
  )(allEpisodes)

  return { allEpisodes, seasons }
}
