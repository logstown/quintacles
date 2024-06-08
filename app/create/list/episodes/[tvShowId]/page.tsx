import { MediaType } from '@prisma/client'
import { convertMediaItem, getEpisodeData } from '@/lib/random'
import { TvShow } from '@/lib/TmdbModels'
import { getMediaItem } from '@/lib/TmdbService'
import { mediaTypes } from '@/lib/mediaTypes'
import BuildListPage from '../../_components/BuildListPage'
import { redirect } from 'next/navigation'

export default async function BuildTvEpisodesListPage({
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

  const episodeData = await getEpisodeData(tvShowId)

  return <BuildListPage restrictions={restrictions} episodeData={episodeData} />
}
