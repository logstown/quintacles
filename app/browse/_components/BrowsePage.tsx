import { CreateListSearchParams, RestrictionsUI } from '@/lib/models'
import { BrowseCriteria } from '../_components/BrowseCriteria'
import { MediaType } from '@prisma/client'
import { UserListsByRestrictions } from '@/components/UserListsByRestrictions'

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
      <UserListsByRestrictions
        restrictions={restrictions}
        sortBy={sortBy}
        exactMatch={exactMatch}
      />
    </div>
  )
}
