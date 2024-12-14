import BrowsePage from '@/app/browse/_components/BrowsePage'
import { CreateListSearchParams } from '@/lib/models'

export const metadata = {
  title: 'User Lists',
}

export default async function UserMediaTypeLists(
  props: {
    params: Promise<{ username: string; mediaTypePlural: string }>
    searchParams: Promise<CreateListSearchParams & { sortBy: string; exactMatch: string }>
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return <BrowsePage searchParams={searchParams} params={params} />
}
