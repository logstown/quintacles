import { getUserListData, ListDetail } from '@/app/list/_components/ListDetail'
import { getListTitle } from '@/components/list-title-base'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { username: string; slug: string }
}): Promise<Metadata> {
  const { userList } = await getUserListData(params)

  if (!userList) {
    return {}
  }

  const title = `Top Five ${getListTitle(true, userList.Restrictions, true)} by @${params.username}`

  return { title }
}

export default async function ListPage({
  params: { username, slug },
}: {
  params: { username: string; slug: string }
}) {
  return <ListDetail username={username} slug={slug} />
}
