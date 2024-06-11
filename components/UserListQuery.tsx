import { UserListCard } from './user-list/UserList'
import { RestrictionsUI } from '@/lib/models'
import prisma from '@/lib/db'
import { pickBy } from 'lodash'
import { MediaType, Prisma } from '@prisma/client'

export async function UserListQuery({
  restrictions,
  userId,
  sortBy,
  exactMatch,
  mediaTypeOnly,
}: {
  restrictions: RestrictionsUI
  sortBy: 'lastUserAddedAt' | 'users'
  userId?: string
  exactMatch?: boolean
  mediaTypeOnly?: boolean
}) {
  const users = userId
    ? {
        some: {
          id: userId,
        },
      }
    : {}

  const Restrictions = exactMatch
    ? {
        is: {
          // uniqueRestrictions: {
          mediaType: restrictions.mediaType,
          genreId: restrictions.genreId ?? 0,
          decade: restrictions.decade ?? 0,
          isLiveActionOnly: restrictions.isLiveActionOnly,
          personId: restrictions.personId ?? 0,
          episodesTvShowId: restrictions.episodesTvShowId ?? 0,
          // },
        },
      }
    : {
        is: pickBy(restrictions, v => v),
      }

  const orderBy =
    sortBy === 'lastUserAddedAt'
      ? {
          lastUserAddedAt: Prisma.SortOrder.desc,
        }
      : {
          users: {
            _count: Prisma.SortOrder.desc,
          },
        }

  const itemSelect = {
    select: {
      name: true,
      posterPath: true,
      backdropPath: true,
    },
  }

  const lists = await prisma.userList.findMany({
    where: {
      users,
      Restrictions,
    },
    take: mediaTypeOnly ? 3 : 5,
    orderBy,
    include: {
      users: true,
      item1: itemSelect,
      item2: itemSelect,
      item3: itemSelect,
      item4: itemSelect,
      item5: itemSelect,
      Restrictions: {
        include: {
          Person: true,
          EpisodesTvShow: true,
        },
      },
    },
  })

  const isEpisodes = restrictions.mediaType === MediaType.TvEpisode

  return (
    <div
      className={`flex ${isEpisodes ? 'flex-wrap gap-12 md:gap-7' : 'flex-col gap-7 md:gap-12'}`}
    >
      {lists.map(list => (
        <UserListCard
          key={list.id}
          restrictions={list.Restrictions}
          id={list.id}
          users={list.users}
          listItemLites={[
            list.item1,
            list.item2,
            list.item3,
            list.item4,
            list.item5,
          ]}
          excludeUser={!!userId}
          excludeTitle={exactMatch}
          lastUserAddedAt={list.lastUserAddedAt}
        />
      ))}
      {lists.length === 0 && (
        <em className='p-10 text-xl text-foreground-500'>Nothing yet</em>
      )}
    </div>
  )
}
