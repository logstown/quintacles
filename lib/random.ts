import { RestrictionsUI, Year } from './models'
import { ListItem, MediaType } from '@prisma/client'
import { mediaTypes } from './mediaTypes'
import { getListTitle } from '@/components/list-title-base'
import slug from 'slug'

export const getUserListsUrl = (
  {
    genreId,
    year,
    isLiveActionOnly,
    personId,
    episodesTvShowId,
    mediaType,
  }: RestrictionsUI,
  page: 'build' | 'browse' = 'build',
): string => {
  const baseUrl =
    page === 'build'
      ? `/create/list/${mediaTypes[mediaType].urlPlural}`
      : `/browse/${mediaTypes[mediaType].urlPlural}`

  // const restrictionsAsStrings = mapValues(restrictions, x => x?.toString())
  // const params = pickBy(restrictionsAsStrings, x => !!x)

  const params = {} as any

  if (genreId) {
    params.genreId = genreId.toString()
  }
  if (year) {
    params.year = year.toString()
  }
  if (isLiveActionOnly) {
    params.isLiveActionOnly = 'true'
  }
  if (personId) {
    params.personId = personId.toString()
  }
  if (episodesTvShowId) {
    params.episodesTvShowId = episodesTvShowId.toString()
  }

  if (page == 'browse' && mediaType !== MediaType.TvEpisode) {
    params.exactMatch = 'true'
  }

  return `${baseUrl}?${new URLSearchParams(params as Record<string, string>)}`
}

export const getYears = (): Year[] => {
  const years = []

  for (let i = new Date().getFullYear(); i >= 1920; i--) {
    const nextYear = i + 1
    if (nextYear % 10 === 0) {
      years.push({
        id: nextYear * 10,
        name: `${nextYear}s`,
      })
    }

    years.push({ id: i, name: `${i} ` })
  }

  return years
}

export const getTmdbImageUrl = (path?: string | null, size?: string): string => {
  if (!path) {
    return '/movieBackdrop.jpeg'
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
    tmdbId: id,
    mediaType,
  }

  switch (mediaType) {
    case MediaType.Movie:
      return {
        ...listItem,
        name: title,
        posterPath: poster_path,
        date: release_date,
        backdropPath: backdrop_path,
        overview,
        seasonNum: null,
        episodeNum: null,
        genreIds: genre_ids,
      }
    case MediaType.TvShow:
      return {
        ...listItem,
        name,
        posterPath: poster_path,
        date: first_air_date,
        backdropPath: backdrop_path,
        overview,
        seasonNum: null,
        episodeNum: null,
        genreIds: genre_ids,
      }
    case MediaType.TvEpisode:
      return {
        ...listItem,
        name,
        date: air_date,
        backdropPath: still_path,
        seasonNum: season_number,
        episodeNum: episode_number,
        overview,
        posterPath: null,
        genreIds: [],
      }
    case MediaType.TvSeason:
      return {
        ...listItem,
        name,
        date: air_date,
        backdropPath: null,
        seasonNum: season_number,
        episodeNum: null,
        overview,
        posterPath: poster_path,
        genreIds: [],
      }
    case MediaType.Person:
      return {
        ...listItem,
        name,
        posterPath: profile_path,
        date: '',
        backdropPath: null,
        overview: '',
        seasonNum: null,
        episodeNum: null,
        genreIds: [],
      }
  }
}

export const getSlug = (restrictions: RestrictionsUI): string => {
  const title = getListTitle(true, restrictions, true)
  return slug(title)
}
