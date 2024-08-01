import { CreateListSearchParams } from '@/lib/models'
import BrowsePage from '../_components/BrowsePage'
import { find } from 'lodash'
import { mediaTypeArr } from '@/lib/mediaTypes'
import { Metadata } from 'next'

export function generateMetadata({
  params: { mediaTypePlural },
}: {
  params: { mediaTypePlural: string }
}): Metadata {
  const metadata = { title: 'Browse' }
  const mediaType = find(mediaTypeArr, { urlPlural: mediaTypePlural })

  if (mediaType) {
    metadata.title = `Browse ${mediaType.display} Lists`
  }

  return metadata
}

export default function BrowsePageBase({
  params,
  searchParams,
}: {
  params: { mediaTypePlural: string }
  searchParams: CreateListSearchParams & {
    sortBy: string
    exactMatch: string
  }
}) {
  return <BrowsePage searchParams={searchParams} params={params} />
}
