import { ImageResponse } from 'next/og'
import { getUserListData, ListDetailProps } from './ListDetail'
import { MediaType } from '@prisma/client'
import { getTmdbImageUrl } from '@/lib/random'

export async function ListOgImage(
  params: ListDetailProps,
  size: { width: number; height: number },
) {
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
          justifyContent: 'flex-end',
        }}
      >
        {userList.Restrictions.mediaType === MediaType.TvShow ||
        userList.Restrictions.mediaType === MediaType.Movie ? (
          <div
            style={{
              display: 'flex',
              paddingBottom: '50px',
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
                  width: '18%',
                }}
              >
                <img
                  src={getTmdbImageUrl(path, 'w154', true)}
                  style={{ borderRadius: '16px', color: 'lightgray' }}
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
