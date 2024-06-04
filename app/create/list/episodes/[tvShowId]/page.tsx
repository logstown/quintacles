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
      EpisodesTvShow = convertMediaItem(tmdbShow, MediaType.TvShow)
    }
  } catch (e) {}

  if (!EpisodesTvShow) {
    console.warn('EpisodesTvShow not found')
    redirect('/')
  }

  const restrictions = {
    decade: 0,
    genreId: 0,
    isLiveActionOnly: false,
    mediaType: MediaType.TvEpisode,
    personId: 0,
    episodesTvShowId: EpisodesTvShow.id,
    EpisodesTvShow,
  }

  const episodeData = await getEpisodeData(tvShowId)

  return <BuildListPage restrictions={restrictions} episodeData={episodeData} />
}
