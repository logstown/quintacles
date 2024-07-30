import { Metadata } from 'next'
import { getUserListData, ListDetail } from '../_components/ListDetail'
import { getListTitle } from '@/components/list-title-base'
import { getTmdbImageUrl } from '@/lib/random'

export async function generateMetadata({
  params: { id },
}: {
  params: { id: number }
}): Promise<Metadata> {
  const { userList, userListUsers, userAddedAt } = await getUserListData({
    id: Number(id),
  })

  if (!userList || !userListUsers || !userAddedAt) {
    return {}
  }

  const title = getListTitle(true, userList.Restrictions, true)

  return {
    title,
    openGraph: {
      title,
      // description: 'The React Framework for the Web',
      url: 'https://www.quintacles.com/',
      siteName: 'Quintacles',
      images: [
        {
          url: getTmdbImageUrl(userList.item1.posterPath, 'w185'), // Must be an absolute URL
        },
        {
          url: getTmdbImageUrl(userList.item2.posterPath, 'w185'), // Must be an absolute URL
        },
        {
          url: getTmdbImageUrl(userList.item3.posterPath, 'w185'), // Must be an absolute URL
        },
        {
          url: getTmdbImageUrl(userList.item4.posterPath, 'w185'), // Must be an absolute URL
        },
        {
          url: getTmdbImageUrl(userList.item5.posterPath, 'w185'), // Must be an absolute URL
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: userAddedAt as unknown as string,
      authors: userListUsers.map(user => user.username),
    },
  }
}

export default async function ListPage({
  params: { id },
}: {
  params: { id: string }
}) {
  return <ListDetail id={Number(id)} />
}
