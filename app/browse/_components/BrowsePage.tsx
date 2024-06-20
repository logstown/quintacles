import { CreateListSearchParams } from '@/lib/models'
import { BrowseCriteria } from '../_components/BrowseCriteria'
import { MediaType } from '@prisma/client'
import { ListTitle } from '@/app/create/criteria/_components/list-title'
import { ListTitleBase } from '@/components/list-title-base'
import { UserListInfinite } from './UserListInfinite'
import { find } from 'lodash'
import { mediaTypeArr } from '@/lib/mediaTypes'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { getRestrictionsFromParams } from '@/lib/random'

export default async function BrowsePage({
  searchParams,
  params: { username, mediaTypePlural },
}: {
  searchParams: CreateListSearchParams & {
    sortBy: string
    exactMatch: string
  }
  params: { username?: string; mediaTypePlural: string }
}) {
  const mediaType = find(mediaTypeArr, { urlPlural: mediaTypePlural })

  if (!mediaType) {
    redirect(`/`)
  }

  let user
  if (username) {
    user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      redirect('/')
    }
  }

  const restrictions = await getRestrictionsFromParams({
    mediaType: mediaType.key,
    searchParams,
  })

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
  //   pageNum: 0,
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
