import { mediaTypeArr } from '@/lib/mediaTypes'
import { find } from 'lodash'
import { redirect } from 'next/navigation'
import { MovieTvCriteriaPage } from '../_components/move-tv-criteria-page'
import { MediaType } from '@prisma/client'
import SeasonsEpisodesCriteriaPage from '../_components/SeasonsEpisodesCriteriaPage'
import { Metadata } from 'next'

export async function generateMetadata(
  props: {
    params: Promise<{ mediaTypePlural: string }>
  }
): Promise<Metadata> {
  const params = await props.params;

  const {
    mediaTypePlural
  } = params;

  const metadata = { title: 'Create' }
  const mediaType = find(mediaTypeArr, { urlPlural: mediaTypePlural })

  if (mediaType) {
    metadata.title = `Create ${mediaType.plural} List`
  }

  return metadata
}

export default async function CriteriaPage(
  props: {
    params: Promise<{ mediaTypePlural: string }>
  }
) {
  const params = await props.params;

  const {
    mediaTypePlural
  } = params;

  const mediaTypeObj = find(mediaTypeArr, { urlPlural: mediaTypePlural })
  if (!mediaTypeObj) {
    redirect('/')
  }

  const mediaType = mediaTypeObj.key

  return mediaType === MediaType.Movie || mediaType === MediaType.TvShow ? (
    <MovieTvCriteriaPage mediaType={mediaType} />
  ) : (
    <SeasonsEpisodesCriteriaPage mediaType={mediaType} />
  )
}
