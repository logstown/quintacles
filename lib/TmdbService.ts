import { MediaType } from '@prisma/client'
import {
  TmdbGenre,
  Movie,
  TvShow,
  MediaItemsResponse,
  TmdbGenres,
  TmdbItem,
  TmdbPerson,
  PopularPeople,
  Season,
} from './TmdbModels'
import { mediaTypes } from './mediaTypes'
import { RestrictionsUI } from './models'

export const getPopular = async (
  mediaType: MediaType,
  page?: number,
  genreIds?: number[],
): Promise<MediaItemsResponse> => {
  page = page || 1
  let url = `discover/${mediaType}?include_adult=false&page=${page}&sort_by=vote_count.desc&with_origin_country=US`
  if (mediaType === MediaType.TvShow) {
    url += '&include_null_first_air_dates=false'
  }
  if (genreIds) {
    url += `&with_genres=`
    genreIds.forEach((genreId, i) => {
      url += genreId
      if (i < genreIds.length - 1) {
        url += '|'
      }
    })
  }

  return fetchFn(url)
}

export const getSuggestionsTmdb = async (
  pageNum: number,
  { decade, personId, genreId, isLiveActionOnly, mediaType }: RestrictionsUI,
): Promise<MediaItemsResponse> => {
  let params: any = {
    page: pageNum.toString(),
    language: 'en-US',
    sort_by: 'vote_count.desc',
    with_original_language: 'en',
  }

  if (genreId) {
    params.with_genres = genreId.toString()
  }

  if (personId) {
    params.with_people = personId.toString()
  }

  if (decade) {
    const dateString =
      mediaType == MediaType.Movie ? 'primary_release_date' : 'air_date'
    params[`${dateString}.gte`] = `${decade}-01-01`
    const ninePlus = Number(decade) + 9
    params[`${dateString}.lte`] = `${ninePlus}-12-31`

    if (mediaType == MediaType.TvShow) {
      params['first_air_date.lte'] = `${ninePlus}-12-31`
    }
  }

  if (isLiveActionOnly) {
    params.without_genres = TmdbGenres.Animation.toString()
  }

  const url = `discover/${mediaTypes[mediaType].url}?${new URLSearchParams(params)}`

  return fetchFn(url)
}

export const getSimilar = async (
  mediaType: MediaType,
  id: number,
): Promise<MediaItemsResponse> => {
  return fetchFn(
    `${mediaTypes[mediaType].url}/${id}/recommendations?language=en-US&page=1`,
  )
}

export const getTmdbGenres = async (
  mediaTypeUrl: string,
): Promise<{ genres: TmdbGenre[] }> => {
  return fetchFn(`genre/${mediaTypeUrl}/list`)
}

export const getMediaItem = async (
  mediaType: MediaType,
  id: number,
): Promise<TvShow | Movie | TmdbPerson> => {
  const url = `${mediaTypes[mediaType].url}/${id}?language=en-US`
  return fetchFn(url)
}

export const searchMedia = async (
  mediaType: MediaType,
  query: string,
): Promise<MediaItemsResponse> => {
  return fetchFn(
    `search/${mediaType}?query=${query}&include_adult=false&language=en-US&page=1`,
  )
}

export const getImageStuff = async (): Promise<any> => {
  return fetchFn(`configuration`)
}

export const getPopularPeople = async (page: number): Promise<PopularPeople> => {
  return fetchFn(`person/popular?page=${page}`)
}

export const getMeMore = async (
  cb: (pageNum: number, params?: any) => Promise<{ results: TmdbItem[] }>,
  pages: number,
  params?: any,
  pageNum?: number,
): Promise<any[]> => {
  pageNum = pageNum || 1

  if (pageNum > pages) {
    return []
  }

  const { results } = params ? await cb(pageNum, params) : await cb(pageNum)

  return [...results, ...(await getMeMore(cb, pages, params, pageNum + 1))]
}

export const getTvSeason = (showId: number, seasonNum: number): Promise<Season> => {
  return fetchFn(`tv/${showId}/season/${seasonNum}`)
}

const fetchFn = async (urlFrag: string) => {
  return fetch(`https://api.themoviedb.org/3/${urlFrag}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNzFiZDk2NWU0YTc1ZDY4YmYzMTBjZDQ5MDY3M2RjMyIsInN1YiI6IjU1NjY1ZDlhYzNhMzY4MTc0ZjAwMDNlNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HRgaHMqbl1iN7E3VLuinS2zgjz9IRcJc6HyEqWin1ZU',
    },
  })
    .then(response => response.json())
    .catch(err => console.error(err))
}
