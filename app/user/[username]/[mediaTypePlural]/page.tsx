import BrowsePage from '@/app/browse/_components/BrowsePage'
import { CreateListSearchParams } from '@/lib/models'

export default async function UserMediaTypeLists({
  params,
  searchParams,
}: {
  params: { username: string; mediaTypePlural: string }
  searchParams: CreateListSearchParams & { sortBy: string; exactMatch: string }
}) {
  return <BrowsePage searchParams={searchParams} params={params} />
}
