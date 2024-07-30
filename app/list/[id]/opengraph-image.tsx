import { ImageResponse } from 'next/og'
import { getUserListData } from '../_components/ListDetail'
import { getListTitle } from '@/components/list-title-base'
import NextImage from 'next/image'
import { getTmdbImageUrl } from '@/lib/random'

export const runtime = 'edge'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params: { id } }: { params: { id: string } }) {
  const { userList, userListUsers, userAddedAt } = await getUserListData({
    id: Number(id),
  })

  if (!userList || !userListUsers || !userAddedAt) {
    return {}
  }

  //   const title = getListTitle(true, userList.Restrictions, true)
  const items = [
    userList.item1,
    userList.item2,
    userList.item3,
    userList.item4,
    userList.item5,
  ]

  //   return {
  //     title,
  //     openGraph: {
  //       title,
  //       // description: 'The React Framework for the Web',
  //       url: 'https://www.quintacles.com/',
  //       siteName: 'Quintacles',
  //       images: [
  //         {
  //           url: getTmdbImageUrl(userList.item1.posterPath, 'w185'), // Must be an absolute URL
  //         },
  //         {
  //           url: getTmdbImageUrl(userList.item2.posterPath, 'w185'), // Must be an absolute URL
  //         },
  //         {
  //           url: getTmdbImageUrl(userList.item3.posterPath, 'w185'), // Must be an absolute URL
  //         },
  //         {
  //           url: getTmdbImageUrl(userList.item4.posterPath, 'w185'), // Must be an absolute URL
  //         },
  //         {
  //           url: getTmdbImageUrl(userList.item5.posterPath, 'w185'), // Must be an absolute URL
  //         },
  //       ],
  //       locale: 'en_US',
  //       type: 'article',
  //       publishedTime: userAddedAt as unknown as string,
  //       authors: userListUsers.map(user => user.username),
  //     },
  //   }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'center',
        }}
      >
        {items.map(item => (
          <img
            key={item.tmdbId}
            src={getTmdbImageUrl(item.posterPath, 'w92')}
            alt={item.name}
          />
        ))}
      </div>
    ),
    {
      ...size,
    },
  )
}
