import { ImageResponse } from 'next/og'
import { getTmdbImageUrl } from '@/lib/random'
import React from 'react'
import { MediaType } from '@prisma/client'
import { getUserListData } from '@/app/list/_components/ListDetail'

// export const runtime = 'edge'

export const alt = 'List'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: { username: string; slug: string }
}) {
  const { userList } = await getUserListData(params)

  if (!userList) {
    return {}
  }

  const posterPaths = [
    userList.item1.posterPath,
    userList.item2.posterPath,
    userList.item3.posterPath,
    userList.item4.posterPath,
    userList.item5.posterPath,
  ]

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
          justifyContent: 'center',
        }}
      >
        {userList.Restrictions.mediaType === MediaType.TvShow ||
        userList.Restrictions.mediaType === MediaType.Movie ? (
          <div
            style={{
              display: 'flex',
              gap: 10,
            }}
          >
            {posterPaths.map((path, i) => (
              <div
                key={path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '19%',
                }}
              >
                <img
                  src={getTmdbImageUrl(path, 'w92', true)}
                  style={{ borderRadius: '16px', color: 'slategray' }}
                  alt='poster'
                />
                <p>{i + 1}</p>
              </div>
            ))}
          </div>
        ) : (
          <img
            src={getTmdbImageUrl(
              userList.Restrictions.EpisodesTvShow.backdropPath ??
                userList.Restrictions.EpisodesTvShow.posterPath,
              'w780',
              true,
            )}
            alt=''
          />
        )}
      </div>
    ),
    {
      ...size,
    },
  )
}
