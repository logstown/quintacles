import { getUserListData, ListDetail } from '@/app/list/_components/ListDetail'
import { getMetaDataListTitle } from '@/components/list-title-base'
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: Promise<{ username: string; slug: string }>
}): Promise<Metadata> {
  const params = await props.params
  const { userList } = await getUserListData(params)

  if (!userList) {
    return {}
  }

  const title = `${getMetaDataListTitle(userList.Restrictions)} by @${params.username}`

  return { title }
}

export default async function ListPage(props: {
  params: Promise<{ username: string; slug: string }>
}) {
  const params = await props.params

  const { username, slug } = params

  return <ListDetail username={username} slug={slug} />
}
