import { ImageResponse } from 'next/og'
import { getUserListData } from '../_components/ListDetail'
import { getListTitle } from '@/components/list-title-base'
import NextImage from 'next/image'
import { getTmdbImageUrl } from '@/lib/random'
import { sql } from '@vercel/postgres'
import { values } from 'lodash'

export const runtime = 'edge'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params: { id } }: { params: { id: string } }) {
  // const { userList, userListUsers, userAddedAt } = await getUserListData({
  //   id: Number(id),
  // })

  // if (!userList || !userListUsers || !userAddedAt) {
  //   return {}
  // }

  const { rows } =
    await sql`SELECT "l"."posterPath" as p1, "l2"."posterPath" as p2,  "l3"."posterPath" as p3,  "l4"."posterPath" as p4,  "l5"."posterPath" as p5
      FROM "UserList" "u"
      JOIN "ListItem" "l"
      ON ("u"."item1Id"= "l"."tmdbId"
      AND "u"."mediaType"= "l"."mediaType")
      JOIN "ListItem" "l2"
      ON ("u"."item2Id"= "l2"."tmdbId"
      AND "u"."mediaType"= "l2"."mediaType")
      JOIN "ListItem" "l3"
      ON ("u"."item3Id"= "l3"."tmdbId"
      AND "u"."mediaType"= "l3"."mediaType")
      JOIN "ListItem" "l4"
      ON ("u"."item4Id"= "l4"."tmdbId"
      AND "u"."mediaType"= "l4"."mediaType")
      JOIN "ListItem" "l5"
      ON ("u"."item5Id"= "l5"."tmdbId"
      AND "u"."mediaType"= "l5"."mediaType")
      WHERE "u"."id"= 11;`

  //   const title = getListTitle(true, userList.Restrictions, true)
  const posterPaths = values(rows) as unknown as string[]

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
        {posterPaths.map((path: string) => (
          <NextImage
            key={path}
            src={getTmdbImageUrl(path, 'w92')}
            width={92}
            height={138}
            alt='poster'
          />
        ))}
      </div>
    ),
    {
      ...size,
    },
  )
}
