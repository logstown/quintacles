import { Metadata } from 'next'
import { getUserListData, ListDetail } from '../_components/ListDetail'
import { getListTitle } from '@/components/list-title-base'

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string }
}): Promise<Metadata> {
  const { userList, userListUsers } = await getUserListData({
    id: Number(id),
  })

  if (!userList) {
    return {}
  }

  const title = `Top Five ${getListTitle(true, userList.Restrictions, true)}`
  const description = `by ${userListUsers.map(user => `@${user.username}`).join(', ')}`

  return { title, description }
}

export default async function ListPage({
  params: { id },
}: {
  params: { id: string }
}) {
  return <ListDetail id={Number(id)} />
}
