import { useQuery } from '@tanstack/react-query'
import { UserListCard } from './user-list/UserList'
import { UserListSkeleton } from './user-list/UserListSkeleton'
import { RestrictionsUI } from '@/lib/models'
import prisma from '@/lib/db'
import { pickBy } from 'lodash'
import { MediaType, Prisma } from '@prisma/client'

export async function UserListQuery({
  restrictions,
  userId,
  sortBy,
  exactMatch,
}: {
  restrictions: RestrictionsUI
  sortBy: 'lastUserAddedAt' | 'users'
  userId?: string
  exactMatch?: boolean
}) {
  // const { data, error, isPending } = useQuery({
  //   queryKey: [
  //     'userListsByMediaType',
  //     restrictions.mediaType,
  //     restrictions,
  //     userId,
  //     sortBy,
  //     exactMatch
  //   ],
  //   queryFn: () => getUserListsByAny({ restrictions, userId, sortBy, exactMatch })
  // })

  const users = userId
    ? {
        some: {
          id: userId,
        },
      }
    : {}

  const Restrictions = exactMatch
    ? {
        equals: restrictions,
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

  const lists = await prisma.userList.findMany({
    where: {
      users,
      Restrictions,
    },
    take: 5,
    orderBy,
    include: {
      users: true,
      items: {
        select: {
          name: true,
          posterPath: true,
          backdropPath: true,
        },
      },
      Restrictions: {
        include: {
          Person: true,
          EpisodesTvShow: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  return (
    <div className={`flex flex-col gap-7 md:gap-12`}>
      {lists.map(list => (
        <UserListCard
          key={list.id}
          restrictions={list.Restrictions as unknown as RestrictionsUI}
          id={list.id}
          users={list.users}
          listItemLites={list.items}
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
