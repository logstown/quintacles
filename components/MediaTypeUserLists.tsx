import { mediaTypeArrForLists, mediaTypes } from '@/lib/mediaTypes'
import { MediaType } from '@prisma/client'
import { Suspense } from 'react'
import { UserListSkeleton } from './user-list/UserListSkeleton'
import { MediaTypeQuery } from '@/app/user/_components/MediaTypeQuery'

export function MediaTypeUserLists({
  userId,
  username,
}: {
  userId?: string
  username?: string
}) {
  return (
    <div className='mx-auto mt-10 flex max-w-screen-lg flex-col gap-20 md:mt-16'>
      {mediaTypeArrForLists.map(mediaType => {
        const isEpisodes = mediaType.key === MediaType.TvEpisode

        return (
          <div
            key={mediaType.key}
            className={`flex flex-col gap-6 md:gap-10 ${isEpisodes ? '' : 'max-w-screen-lg'}`}
          >
            <h1 className='pl-4 text-2xl font-bold capitalize md:text-5xl'>
              <span className='text-foreground-400'>Latest </span>
              {mediaTypes[mediaType.key].display}
            </h1>
            <Suspense
              key={JSON.stringify({ mediaType: mediaType.key })}
              fallback={
                <div
                  className={`flex ${isEpisodes ? 'flex-wrap gap-12 md:gap-7' : 'flex-col gap-7 md:gap-12'}`}
                >
                  {[1, 2, 3].map(i => (
                    <UserListSkeleton key={i} isEpisodes={isEpisodes} />
                  ))}
                </div>
              }
            >
              <MediaTypeQuery
                userId={userId}
                username={username}
                mediaType={mediaType.key}
              />
            </Suspense>
          </div>
        )
      })}
    </div>
  )
}
