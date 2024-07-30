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
  const description = `by ${userListUsers.map(user => `@${user.username}`).join(', ')}`

  return {
    title,
    openGraph: {
      title,
      description,
      url: 'https://www.quintacles.com/',
      siteName: 'Quintacles',
      images: [
        {
          url: getTmdbImageUrl(userList.item5.backdropPath, 'w300'), // Must be an absolute URL
        },
        {
          url: getTmdbImageUrl(userList.item4.backdropPath, 'w300'), // Must be an absolute URL
        },
        {
          url: getTmdbImageUrl(userList.item3.backdropPath, 'w300'), // Must be an absolute URL
        },
        {
          url: getTmdbImageUrl(userList.item2.backdropPath, 'w300'), // Must be an absolute URL
        },
        {
          url: getTmdbImageUrl(userList.item1.backdropPath, 'w300'), // Must be an absolute URL
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: userAddedAt as unknown as string,
      authors: userListUsers.map(user => user.username),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // siteId: '1467726470533754880',
      // creator: '@nextjs',
      // creatorId: '1467726470533754880',
      images: [
        getTmdbImageUrl(userList.item5.backdropPath, 'w300'),
        getTmdbImageUrl(userList.item4.backdropPath, 'w300'),
        getTmdbImageUrl(userList.item3.backdropPath, 'w300'),
        getTmdbImageUrl(userList.item2.backdropPath, 'w300'),
        getTmdbImageUrl(userList.item1.backdropPath, 'w300'),
      ], // Must be an absolute URL
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
