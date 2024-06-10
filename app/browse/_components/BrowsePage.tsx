import { CreateListSearchParams, RestrictionsUI } from '@/lib/models'
import { ListTitle } from '@/app/create/criteria/_components/list-title'
import { ListTitleBase } from '@/components/list-title-base'
import { UserListQuery } from '@/components/UserListQuery'
import { Suspense } from 'react'
import { UserListSkeleton } from '@/components/user-list/UserListSkeleton'
import { BrowseCriteria } from '../_components/BrowseCriteria'
import { MediaType } from '@prisma/client'

export default async function BrowsePage({
  searchParams,
  restrictions,
}: {
  searchParams: CreateListSearchParams & { sortBy: string; exactMatch: string }
  restrictions: RestrictionsUI
}) {
  const sortBy =
    searchParams.sortBy === 'lastUserAddedAt' || searchParams.sortBy === 'users'
      ? searchParams.sortBy
      : 'lastUserAddedAt'
  const exactMatch =
    searchParams.exactMatch == 'true' || !!restrictions.episodesTvShowId

  const isEpisodes = restrictions.mediaType === MediaType.TvEpisode

  return (
    <div
      className={`mx-auto flex max-w-screen-xl flex-col gap-14 pb-20 ${isEpisodes ? 'items-stert' : 'items-center'} `}
    >
      <BrowseCriteria
        restrictionsFromParent={restrictions}
        sortByFromParent={sortBy}
        exactMatchFromParent={exactMatch}
      />
      <div className={`flex flex-col gap-10 ${isEpisodes ? '' : 'max-w-screen-lg'}`}>
        {exactMatch && (
          <ListTitle mediaType={restrictions.mediaType}>
            <ListTitleBase restrictions={restrictions} />
          </ListTitle>
        )}
        <Suspense
          key={JSON.stringify({ restrictions, sortBy, exactMatch })}
          fallback={
            <div
              className={`flex ${isEpisodes ? 'flex-wrap gap-12 md:gap-7' : 'flex-col gap-7 md:gap-12'}`}
            >
              {[1, 2, 3, 4].map(i => (
                <UserListSkeleton key={i} isEpisodes={isEpisodes} />
              ))}{' '}
            </div>
          }
        >
          <UserListQuery
            restrictions={restrictions}
            sortBy={sortBy}
            exactMatch={exactMatch}
          />
        </Suspense>
      </div>
    </div>
  )
}
