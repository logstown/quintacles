import { ImageResponse } from 'next/og'
import { getUserListData } from '../_components/ListDetail'
import { getListTitle } from '@/components/list-title-base'
import NextImage from 'next/image'
import { getTmdbImageUrl } from '@/lib/random'
import { sql } from '@vercel/postgres'
import { omit, rest, values } from 'lodash'
import { Metadata } from 'next'
import { RestrictionsUI } from '@/lib/models'

// export const runtime = 'edge'

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

  console.log(userList)

  const { rows } =
    await sql`SELECT "l"."posterPath" as p1, "l2"."posterPath" as p2,  "l3"."posterPath" as p3,  "l4"."posterPath" as p4,  "l5"."posterPath" as p5, 
      "r".* as restrictions, 
      "t"."name" as tvShowName
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
      JOIN "Restrictions" "r"
      ON ("u"."restrictionsSlug"= "r"."slug")
      JOIN "TvShowLite" "t"
      ON ("r"."episodesTvShowId"= "t"."id")
      JOIN "Person" "p"
      ON ("r"."personId"= "p"."id")
      WHERE "u"."id"= ${id};`

  const obj = rows[0]
  console.log(obj)

  const posterPaths = [obj.p1, obj.p2, obj.p3, obj.p4, obj.p5]
  const restrictions = omit(obj, ['p1', 'p2', 'p3', 'p4', 'p5'])
  const title = getListTitle(true, restrictions as RestrictionsUI, true)

  // console.log(restrictions)

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
          fontSize: 28,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>Top Five {title}</h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'center',
          }}
        >
          {posterPaths.map((path: string) => (
            <img
              key={path}
              src={getTmdbImageUrl(path, 'w92', true)}
              style={{ width: '18%', borderRadius: '12px' }}
              alt='poster'
            />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
