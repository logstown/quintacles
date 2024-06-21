'server only'

import { pickBy } from 'lodash'
import { RestrictionsUI } from './models'
import { Prisma } from '@prisma/client'
import prisma from './db'

export async function userListQuery({
  userId,
  exactMatch = false,
  restrictions,
  sortBy = 'lastUserAddedAt',
  pageSize = 5,
  pageNum = 1,
}: {
  restrictions: RestrictionsUI
  userId?: string
  exactMatch?: boolean
  sortBy: 'lastUserAddedAt' | 'users'
  pageSize: number
  pageNum: number
}) {
  const users = userId
    ? {
        some: {
          id: userId,
        },
      }
    : {
        some: {},
      }

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

  return prisma.userList.findMany({
    where: {
      users,
      Restrictions,
    },
    take: pageSize,
    skip: pageNum * pageSize,
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
}
