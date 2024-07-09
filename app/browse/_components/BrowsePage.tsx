import { CreateListSearchParams } from '@/lib/models'
import { BrowseCriteria } from '../_components/BrowseCriteria'
import { ListTitle } from '@/app/create/criteria/_components/list-title'
import { ListTitleBase } from '@/components/list-title-base'
import { UserListInfinite } from './UserListInfinite'
import { find } from 'lodash'
import { mediaTypeArr } from '@/lib/mediaTypes'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { getRestrictionsFromParams } from '@/lib/server-functions'
import Link from 'next/link'
import { Avatar } from '@nextui-org/avatar'

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

  // const initialData = await userListQuery({
  //   userId: user?.id,
  //   restrictions,
  //   sortBy,
  //   exactMatch,
  //   pageSize: 5,
  //   pageNum: 0,
  // })

  return (
    <div className='mx-auto flex w-full flex-col items-center gap-8 pb-20'>
      {user ? (
        <Link href={`/user/${user.username}`}>
          <div className='flex items-center gap-4'>
            <Avatar
              isBordered
              src={user.photoURL ?? undefined}
              className='min-h-24 min-w-24 text-large'
            />
            <div className='font-semibold'>
              <div className='whitespace-nowrap text-3xl text-foreground-800'>
                {user.displayName}
              </div>
              <div className='text-xl text-foreground-400'>@{user.username}</div>
            </div>
          </div>
        </Link>
      ) : (
        <h1 className='text-6xl font-semibold'>Browse</h1>
      )}
      <div className={`flex w-full max-w-screen-lg flex-col items-center gap-14`}>
        <BrowseCriteria
          restrictionsFromParent={restrictions}
          sortByFromParent={sortBy}
          exactMatchFromParent={exactMatch}
          user={user}
        />
        <div className={`flex w-full flex-col gap-10`}>
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
    </div>
  )
}
