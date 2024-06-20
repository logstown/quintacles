import { CreateListSearchParams } from '@/lib/models'
import BrowsePage from '../_components/BrowsePage'

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
