import { mediaTypeArr } from '@/lib/mediaTypes'
import { find } from 'lodash'
import { redirect } from 'next/navigation'
import { MovieTvCriteriaPage } from '../_components/move-tv-criteria-page'
import { MediaType } from '@prisma/client'
import SeasonsEpisodesCriteriaPage from '../_components/SeasonsEpisodesCriteriaPage'
import { Metadata } from 'next'

export function generateMetadata({
  params: { mediaTypePlural },
}: {
  params: { mediaTypePlural: string }
}): Metadata {
  const metadata = { title: 'Create' }
  const mediaType = find(mediaTypeArr, { urlPlural: mediaTypePlural })

  if (mediaType) {
    metadata.title = `Create ${mediaType.plural} List`
  }

  return metadata
}

export default function CriteriaPage({
  params: { mediaTypePlural },
}: {
  params: { mediaTypePlural: string }
}) {
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
