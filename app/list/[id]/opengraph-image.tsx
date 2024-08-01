import { ImageResponse } from 'next/og'
import { getUserListData } from '../_components/ListDetail'
import { getListTitle } from '@/components/list-title-base'
import NextImage from 'next/image'
import { getTmdbImageUrl } from '@/lib/random'
import { sql } from '@vercel/postgres'
import { omit, rest, values } from 'lodash'
import { Metadata } from 'next'
import { RestrictionsUI } from '@/lib/models'
import React from 'react'
import { MediaType } from '@prisma/client'

// export const runtime = 'edge'

export const alt = 'List'
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
              alignItems: 'center',
              gap: 10,
              justifyContent: 'center',
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
