import { ListTitle } from '@/app/create/criteria/_components/list-title'
import { RestrictionsUI, UserListSortBy } from '@/lib/models'
import { Suspense } from 'react'
import { UserListQuery } from './UserListQuery'
import { ListTitleBase } from './list-title-base'
import { UserListSkeleton } from './user-list/UserListSkeleton'
import { MediaType } from '@prisma/client'
import { mediaTypes } from '@/lib/mediaTypes'

export function UserListsByRestrictions({
  restrictions,
  exactMatch,
  sortBy,
  mediaTypeOnly,
  userId,
  username,
}: {
  restrictions: RestrictionsUI
  exactMatch: boolean
  sortBy: UserListSortBy
  mediaTypeOnly?: boolean
  userId?: string
  username?: string
}) {
  const isEpisodes = restrictions.mediaType === MediaType.TvEpisode

  return (
    <div className={`flex flex-col gap-10 ${isEpisodes ? '' : 'max-w-screen-lg'}`}>
      {exactMatch && (
        <ListTitle mediaType={restrictions.mediaType}>
          <ListTitleBase restrictions={restrictions} />
        </ListTitle>
      )}
      {mediaTypeOnly && (
        <h1 className='pl-4 text-5xl font-bold capitalize'>
          {mediaTypes[restrictions.mediaType].plural}
        </h1>
      )}
      <Suspense
        key={JSON.stringify({ restrictions, sortBy, exactMatch })}
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
        <UserListQuery
          restrictions={restrictions}
          sortBy={sortBy}
          exactMatch={exactMatch}
          mediaTypeOnly={mediaTypeOnly}
          userId={userId}
          username={username}
        />
      </Suspense>
    </div>
  )
}
