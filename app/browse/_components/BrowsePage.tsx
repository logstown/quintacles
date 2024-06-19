import { CreateListSearchParams, RestrictionsUI } from '@/lib/models'
import { BrowseCriteria } from '../_components/BrowseCriteria'
import { MediaType, User } from '@prisma/client'
import { ListTitle } from '@/app/create/criteria/_components/list-title'
import { ListTitleBase } from '@/components/list-title-base'
import { UserListInfinite } from './UserListInfinite'

export default function BrowsePage({
  searchParams,
  restrictions,
  user,
}: {
  searchParams: CreateListSearchParams & { sortBy: string; exactMatch: string }
  restrictions: RestrictionsUI
  user?: User
}) {
  const sortBy =
    searchParams.sortBy === 'lastUserAddedAt' || searchParams.sortBy === 'users'
      ? searchParams.sortBy
      : 'lastUserAddedAt'
  const exactMatch =
    searchParams.exactMatch == 'true' || !!restrictions.episodesTvShowId

  const isEpisodes = restrictions.mediaType === MediaType.TvEpisode

  // const initialData = await userListQuery({
  //   userId: user?.id,
  //   restrictions,
  //   sortBy,
  //   exactMatch,
  //   pageSize: 5,
  //   pageNum: 1,
  // })

  return (
    <div
      className={`mx-auto flex max-w-screen-xl flex-col gap-14 pb-20 ${isEpisodes ? 'items-stert' : 'items-center'} `}
    >
      <BrowseCriteria
        restrictionsFromParent={restrictions}
        sortByFromParent={sortBy}
        exactMatchFromParent={exactMatch}
        user={user}
      />
      <div
        className={`flex flex-col items-center gap-10 ${isEpisodes ? '' : 'max-w-screen-lg'}`}
      >
        {exactMatch && (
          // <div className='sticky top-16 z-30 flex w-full justify-center bg-background'>  TODO: Fix this
          <ListTitle mediaType={restrictions.mediaType}>
            <ListTitleBase restrictions={restrictions} />
          </ListTitle>
          // </div>
        )}
        <UserListInfinite
          restrictions={restrictions}
          sortBy={sortBy}
          exactMatch={exactMatch}
          userId={user?.id}
        />
      </div>
    </div>
  )
}
