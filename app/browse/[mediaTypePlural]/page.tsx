import { mediaTypeArr } from '@/lib/mediaTypes'
import { CreateListSearchParams } from '@/lib/models'
import { MediaType } from '@prisma/client'
import { find } from 'lodash'
import { redirect } from 'next/navigation'
import EpisodesBrowse from '../_components/EpisodesBrowse'
import MoviesOrShowsPage from '../_components/MoviesOrShowsPage'

export default function BrowsePageBase({
  params: { mediaTypePlural },
  searchParams,
}: {
  params: { mediaTypePlural: string }
  searchParams: CreateListSearchParams & {
    sortBy: string
    exactMatch: string
    tvShowId: string
  }
}) {
  const mediaType = find(mediaTypeArr, { urlPlural: mediaTypePlural })

  if (!mediaType) {
    redirect(`/`)
  }

  switch (mediaType.key) {
    case MediaType.TvEpisode:
      return <EpisodesBrowse searchParams={searchParams} />
    default:
      return (
        <MoviesOrShowsPage searchParams={searchParams} mediaType={mediaType.key} />
      )
  }
}
