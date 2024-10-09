import { UserTime } from '../UserTime'
import { BackdropCollageStraight, PosterCollageStraight } from './PosterCollage'
import { UserListIcon } from './UserListIcon'
import { getUserListsUrl } from '../../lib/random'
import { MediaType, User } from '@prisma/client'
import { RestrictionsUI } from '@/lib/models'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import Link from 'next/link'
import { ListTitleBase } from '../list-title-base'
import { UserListButtons } from '../UserListButtons'
import { UserListLink } from './UserListLink'
import { cloneElement } from 'react'
import { mediaTypes } from '@/lib/mediaTypes'

export function UserListCard({
  restrictions,
  id,
  listItemLites,
  lastUserAddedAt,
  users,
  excludeUser,
  excludeTitle,
  linkIsHardReload,
}: {
  restrictions: RestrictionsUI
  id: number
  users: User[]
  listItemLites: {
    name: string
    posterPath: string | null
    backdropPath: string | null
  }[]
  lastUserAddedAt: Date
  excludeUser?: boolean
  excludeTitle?: boolean
  linkIsHardReload?: boolean
}) {
  const { Person, mediaType } = restrictions
  const isEpisodes = mediaType === MediaType.TvEpisode
  const usernames = users.map(u => u.username)
  const mediaTypeIcon = cloneElement(mediaTypes[mediaType].icon, {
    strokeWidth: 1.75,
    className: 'h-[1em] w-[1em]',
  })

  return (
    <div className='flex gap-4'>
      {excludeTitle && !isEpisodes && (
        <UserTime
          excludeUser={false}
          users={users}
          lastUserAddedAt={lastUserAddedAt}
          size='lg'
        />
      )}
      <Card
        shadow='lg'
        className={`w-fit overflow-visible p-0 dark:bg-neutral-900 ${isEpisodes ? 'sm:p-3' : 'sm:px-5 sm:pb-6 sm:pt-2'}`}
      >
        <CardHeader
          className={`${isEpisodes ? 'justify-center' : 'justify-between py-3 md:py-6'} pl-4`}
        >
          {!excludeTitle && (
            <>
              <div
                className={`flex items-center gap-2 sm:items-baseline ${isEpisodes ? 'justify-center' : 'sm:gap-4'}`}
              >
                <Link
                  scroll={false}
                  href={getUserListsUrl(restrictions, 'browse')}
                  color='foreground'
                  className={`flex w-full items-center gap-2 sm:gap-4`}
                >
                  {!!Person?.id && (
                    <div className='pl-1'>
                      <UserListIcon
                        mediaType={mediaType}
                        personPath={Person.profilePath}
                        useMediaIcon={false}
                      />
                    </div>
                  )}
                  <div
                    className={`flex items-center gap-2 font-semibold tracking-tight sm:gap-3 ${isEpisodes ? 'max-w-[267px] text-2xl' : 'text-xl sm:text-3xl md:text-4xl'}`}
                  >
                    {!isEpisodes && !Person?.id && (
                      <div className='text-foreground-500'>{mediaTypeIcon}</div>
                    )}
                    <div
                      className={`${mediaType === MediaType.TvShow ? 'mt-1' : ''} ${isEpisodes ? 'truncate' : 'drop-shadow-2xl'}`}
                    >
                      <ListTitleBase restrictions={restrictions} />
                    </div>
                  </div>
                </Link>
                {!isEpisodes && (
                  <UserListButtons
                    isSmall
                    userListId={id}
                    Restrictions={restrictions}
                    usernames={usernames}
                  />
                )}
              </div>
              {!isEpisodes && (
                <UserTime
                  excludeUser={false}
                  users={users}
                  lastUserAddedAt={lastUserAddedAt}
                  size='sm'
                />
              )}
            </>
          )}
        </CardHeader>
        <CardBody
          className={`overflow-visible ${isEpisodes ? 'pt-0' : 'px-1 pb-2 pt-1 sm:px-3'}`}
        >
          <UserListLink
            isHardReload={linkIsHardReload}
            listId={id}
            restrictions={restrictions}
            usernames={usernames}
          >
            {isEpisodes ? (
              <BackdropCollageStraight backdropLites={listItemLites} />
            ) : (
              <PosterCollageStraight
                isSeasons={mediaType === MediaType.TvSeason}
                posterLites={listItemLites}
              />
            )}
          </UserListLink>
        </CardBody>
        {isEpisodes && (
          <CardFooter className='flex justify-center gap-6'>
            <UserListButtons
              isSmall
              userListId={id}
              Restrictions={restrictions}
              usernames={usernames}
            />
            <UserTime
              excludeUser={excludeUser}
              users={users}
              lastUserAddedAt={lastUserAddedAt}
              size='sm'
            />
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
