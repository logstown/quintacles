import { MediaType } from '@prisma/client'
import { convertMediaItem } from '@/lib/random'
import { Season, TvEpisode, TvShow } from '@/lib/TmdbModels'
import { getMediaItem, getTvSeason } from '@/lib/TmdbService'
import { mediaTypes } from '@/lib/mediaTypes'
import BuildListPage from '../../_components/BuildListPage'
import { redirect } from 'next/navigation'
import { reject } from 'lodash'
import { flow, map, sortBy, uniq } from 'lodash/fp'

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

export default async function BuildMoviesListPage({
  params,
}: {
  params: { tvShowId: number }
}) {
  const tvShowId = Number(params.tvShowId)
  let EpisodesTvShow
  try {
    const tmdbShow = (await getMediaItem(
      mediaTypes[MediaType.TvShow].key,
      tvShowId,
    )) as TvShow

    if (tmdbShow) {
      EpisodesTvShow = convertMediaItem(tmdbShow, MediaType.TvShow)
    }
  } catch (e) {}

  if (!EpisodesTvShow) {
    console.warn('EpisodesTvShow not found')
    redirect('/')
  }

  const restrictions = {
    decade: null,
    genreId: null,
    isLiveActionOnly: null,
    mediaType: MediaType.TvEpisode,
    personId: null,
    episodesTvShowId: EpisodesTvShow.id,
    EpisodesTvShow,
  }

  const allEpisodes = await fetchAllEpisodes(tvShowId, 1)
  const seasons = flow(
    map('season_number'),
    map(x => x.toString()),
    uniq,
    sortBy(x => Number(x)),
  )(allEpisodes)

  return (
    <BuildListPage
      restrictions={restrictions}
      episodeData={{ allEpisodes, seasons }}
    />
  )
}
