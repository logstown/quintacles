import { UserTime } from '../UserTime'
import { BackdropCollageStraight, PosterCollageStraight } from './PosterCollage'
import { UserListIcon } from './UserListIcon'
import { getUserListsUrl } from '../../lib/random'
import { MediaType, User } from '@prisma/client'
import { RestrictionsUI } from '@/lib/models'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import Link from 'next/link'
import { ListTitleBase } from '../list-title-base'
import { Divider } from '@nextui-org/divider'
import { UserListButtons } from '../UserListButtons'
import { UserListLink } from './UserListLink'
import { getGenreById } from '@/lib/genres'
import { cloneElement } from 'react'
import { GenreIcon } from './GenreIcon'

export function UserListCard({
  restrictions,
  id,
  listItemLites,
  lastUserAddedAt,
  users,
  excludeUser,
  excludeTitle,
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
}) {
  const { Person, mediaType } = restrictions
  const isEpisodes = mediaType === MediaType.TvEpisode
  const usernames = users.map(u => u.username)

  return (
    <Card
      shadow='lg'
      className={`w-fit overflow-visible p-0 dark:outline-foreground-100 ${isEpisodes ? 'sm:p-3' : 'sm:px-4 sm:py-2'}`}
    >
      {excludeTitle ? (
        <div className='w-full p-4'></div>
      ) : (
        <Link href={getUserListsUrl(restrictions, 'browse')} color='foreground'>
          <CardHeader className={`${isEpisodes ? '' : 'py-3 md:py-6'} pl-4`}>
            <div
              className={`flex w-full items-center gap-6 truncate ${isEpisodes ? 'justify-center' : ''}`}
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
                className={`flex items-center gap-3 text-2xl font-semibold ${isEpisodes ? '' : 'sm:text-4xl'}`}
              >
                <GenreIcon genreId={restrictions.genreId} />
                <ListTitleBase restrictions={restrictions} />
              </div>
            </div>
          </CardHeader>
        </Link>
      )}
      <CardBody
        className={`overflow-visible ${isEpisodes ? 'pt-0' : 'px-1 pb-2 pt-1 sm:px-3'}`}
      >
        <UserListLink listId={id} restrictions={restrictions} usernames={usernames}>
          {isEpisodes ? (
            <BackdropCollageStraight backdropLites={listItemLites} />
          ) : (
            <PosterCollageStraight posterLites={listItemLites} />
          )}
        </UserListLink>
      </CardBody>
      <CardFooter className='flex items-center justify-center gap-5 sm:justify-end'>
        <div className='mr-1'>
          <UserTime
            excludeUser={false}
            users={users}
            lastUserAddedAt={lastUserAddedAt}
            size='sm'
          />
        </div>
        <Divider className='h-5' orientation='vertical' />
        <UserListButtons
          isSmall
          userListId={id}
          Restrictions={restrictions}
          usernames={usernames}
        />
      </CardFooter>
    </Card>
  )
}
