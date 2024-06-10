import { MediaType } from '@prisma/client'
import { TvShow } from '@/lib/TmdbModels'
import { getMediaItem } from '@/lib/TmdbService'
import { mediaTypes } from '@/lib/mediaTypes'
import { redirect } from 'next/navigation'
import BrowsePage from '../_components/BrowsePage'

export default async function MoviesOrShowsPage({
  searchParams,
}: {
  searchParams: { sortBy: string; exactMatch: string; tvShowId: string }
}) {
  const tvShowId = Number(searchParams.tvShowId)
  let EpisodesTvShow
  try {
    const tmdbShow = (await getMediaItem(
      mediaTypes[MediaType.TvShow].key,
      tvShowId,
    )) as TvShow

    if (tmdbShow) {
      EpisodesTvShow = {
        id: tmdbShow.id,
        name: tmdbShow.name,
        posterPath: tmdbShow.poster_path,
      }
    }
  } catch (e) {}

  if (!EpisodesTvShow) {
    console.warn('EpisodesTvShow not found')
    redirect('/')
  }

  const restrictions = {
    mediaType: MediaType.TvEpisode,
    episodesTvShowId: EpisodesTvShow.id,
    EpisodesTvShow,
  }

  return <BrowsePage restrictions={restrictions} searchParams={searchParams} />
}
