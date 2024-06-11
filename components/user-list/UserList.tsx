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
  id: string
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
  const userIds = users.map(u => u.id)

  return (
    <Card shadow='lg' className='w-fit overflow-visible p-0 sm:p-2'>
      {excludeTitle ? (
        <div className='w-full p-4'></div>
      ) : (
        <Link href={getUserListsUrl(restrictions, 'browse')} color='foreground'>
          <CardHeader className={`pl-4`}>
            <div className='flex w-full items-baseline gap-3 truncate'>
              <div className={`pl-1 ${Person?.id ? '' : 'hidden'}`}>
                <UserListIcon
                  mediaType={mediaType}
                  personPath={Person!.profilePath}
                  useMediaIcon={false}
                />
              </div>
              <h2
                className={`font-semibold ${isEpisodes ? 'text-2xl' : 'text-2xl sm:text-4xl'}`}
              >
                <ListTitleBase restrictions={restrictions} />
              </h2>
            </div>
          </CardHeader>
        </Link>
      )}
      <CardBody className={`overflow-visible ${isEpisodes ? 'pt-0' : 'pb-2 pt-1'}`}>
        <Link href={`/list/${id}`} color='foreground'>
          {isEpisodes ? (
            <BackdropCollageStraight backdropLites={listItemLites} />
          ) : (
            <PosterCollageStraight posterLites={listItemLites} />
          )}
        </Link>
      </CardBody>
      <CardFooter className='flex items-center justify-center gap-5'>
        <div className='mr-1'>
          <UserTime
            excludeUser={false}
            users={users}
            lastUserAddedAt={lastUserAddedAt}
            size='sm'
          />
        </div>
        <Divider className='h-4' orientation='vertical' />
        <UserListButtons
          isSmall
          userListId={id}
          Restrictions={restrictions}
          userListUserIds={userIds}
        />
      </CardFooter>
    </Card>
  )
}
