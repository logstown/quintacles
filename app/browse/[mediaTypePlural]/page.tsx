import { CreateListSearchParams } from '@/lib/models'
import BrowsePage from '../_components/BrowsePage'
import { find } from 'lodash'
import { mediaTypeArr } from '@/lib/mediaTypes'
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: Promise<{ mediaTypePlural: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { mediaTypePlural } = params

  const metadata = { title: 'Browse' }
  const mediaType = find(mediaTypeArr, { urlPlural: mediaTypePlural })

  if (mediaType) {
    metadata.title = `Browse ${mediaType.display} Lists`
  }

  return metadata
}

export default async function BrowsePageBase(props: {
  params: Promise<{ mediaTypePlural: string }>
  searchParams: Promise<
    CreateListSearchParams & {
      sortBy: string
      exactMatch: string
    }
  >
}) {
  const searchParams = await props.searchParams
  const params = await props.params
  return <BrowsePage searchParams={searchParams} params={params} />
}
