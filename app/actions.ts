'use server'

import { TmdbGenres, TmdbPerson } from '@/lib/TmdbModels'
import { getPopularPeople, getSuggestionsTmdb } from '@/lib/TmdbService'
import prisma from '@/lib/db'
import { getGenres } from '@/lib/genres'
import { Genre, RestrictionsUI, Year } from '@/lib/models'
import { getSlug, getUserListsUrl, getYears } from '@/lib/random'
import { userListQuery } from '@/lib/server-functions'
import { User, auth, currentUser } from '@clerk/nextjs/server'
import { ListItem, MediaType, PrismaPromise, UserList } from '@prisma/client'
import { some } from 'lodash'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { redirect } from 'next/navigation'

export async function surpriseMe(mediaType: MediaType) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('User not found')
  }

  const userRestrictionsArr = await unstable_cache(
    () =>
      prisma.restrictions.findMany({
        where: {
          userLists: {
            some: {
              users: {
                some: { userId },
              },
            },
          },
          mediaType,
        },
      }),
    ['user-restrictions', userId, mediaType],
    { tags: [`user-mediaType-${userId}-${mediaType}`] },
  )()

  const { results: popularPeople } =
    mediaType === MediaType.Movie ? await getPopularPeople(1) : { results: [] }
  const years = getYears()
  const genres = getGenres(mediaType)

  const getRandomInt = (max: number, min?: number): number => {
    min = min || 0

    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  }

  const alreadyExists = (
    genre: Genre | undefined,
    year: Year | undefined,
    moviePerson: TmdbPerson | undefined,
    isLiveActionOnly: boolean,
  ) =>
    some(
      userRestrictionsArr,
      restrictions =>
        restrictions.genreId === (genre?.id ?? 0) &&
        restrictions.year === (year?.id ?? 0) &&
        restrictions.personId === (moviePerson?.id ?? 0) &&
        restrictions.isLiveActionOnly === isLiveActionOnly,
    )

  let genre: Genre | undefined,
    year: Year | undefined,
    moviePerson: TmdbPerson | undefined,
    isLiveActionOnly: boolean
  do {
    genre = undefined
    year = undefined
    moviePerson = undefined
    isLiveActionOnly = false

    if (Math.random() <= 0.4) {
      genre = genres[getRandomInt(genres.length)]
    }

    if (Math.random() <= 0.2) {
      year = years[getRandomInt(years.length)]
    }

    if (popularPeople.length && (!genre || !year) && Math.random() <= 0.15) {
      const { id, name, profile_path } =
        popularPeople[getRandomInt(popularPeople.length)]
      moviePerson = { id, name, profile_path }
    }

    if (genre?.id !== TmdbGenres.Animation && Math.random() < 0.15) {
      isLiveActionOnly = true
    }
  } while (
    (!genre && !year && !moviePerson && !isLiveActionOnly) ||
    alreadyExists(genre, year, moviePerson, isLiveActionOnly)
  )

  const buildURL = getUserListsUrl(
    {
      mediaType,
      genreId: genre?.id ?? 0,
      year: year?.id ?? 0,
      isLiveActionOnly,
      personId: moviePerson?.id ?? 0,
      episodesTvShowId: 0,
    },
    'build',
  )

  redirect(buildURL)

  return userRestrictionsArr
}

export async function getSuggestions(pageNum: number, restrictions: RestrictionsUI) {
  const res = await getSuggestionsTmdb(pageNum, restrictions)
  return res
}

function createOrConnectUserToList(
  user: User,
  restrictions: RestrictionsUI,
  listItems: ListItem[],
  isUpdate = false,
): PrismaPromise<UserList> {
  let {
    mediaType,
    year,
    isLiveActionOnly,
    genreId,
    Person,
    EpisodesTvShow,
    Network,
  } = restrictions

  Person = Person ?? {
    id: 0,
    name: '',
    profilePath: null,
  }

  EpisodesTvShow = EpisodesTvShow ?? {
    id: 0,
    name: '',
    posterPath: null,
    backdropPath: null,
  }

  Network = Network ?? {
    id: 0,
    name: '',
    logoPath: null,
  }

  const slug = getSlug(restrictions)

  const Restrictions = isUpdate
    ? {
        connect: { slug },
      }
    : {
        connectOrCreate: {
          where: { slug },
          create: {
            slug,
            mediaType,
            year,
            isLiveActionOnly,
            genreId,
            Person: {
              connectOrCreate: {
                where: { id: Person.id },
                create: Person,
              },
            },
            Network: {
              connectOrCreate: {
                where: { id: Network.id },
                create: Network,
              },
            },
            EpisodesTvShow: {
              connectOrCreate: {
                where: { id: EpisodesTvShow.id },
                create: EpisodesTvShow,
              },
            },
          },
        },
      }

  const users = {
    create: { userId: user.id, username: user.username! },
  }

  return prisma.userList.upsert({
    where: {
      uniqueList: {
        restrictionsSlug: slug,
        item1Id: listItems[0].tmdbId,
        item2Id: listItems[1].tmdbId,
        item3Id: listItems[2].tmdbId,
        item4Id: listItems[3].tmdbId,
        item5Id: listItems[4].tmdbId,
      },
    },
    update: {
      users,
      lastUserAddedAt: new Date(),
    },
    create: {
      users,
      Restrictions,
      item1: {
        connectOrCreate: {
          where: {
            uniqueListItem: {
              tmdbId: listItems[0].tmdbId,
              mediaType,
            },
          },
          create: listItems[0],
        },
      },
      item2: {
        connectOrCreate: {
          where: {
            uniqueListItem: {
              tmdbId: listItems[1].tmdbId,
              mediaType,
            },
          },
          create: listItems[1],
        },
      },
      item3: {
        connectOrCreate: {
          where: {
            uniqueListItem: {
              tmdbId: listItems[2].tmdbId,
              mediaType,
            },
          },
          create: listItems[2],
        },
      },
      item4: {
        connectOrCreate: {
          where: {
            uniqueListItem: {
              tmdbId: listItems[3].tmdbId,
              mediaType,
            },
          },
          create: listItems[3],
        },
      },
      item5: {
        connectOrCreate: {
          where: {
            uniqueListItem: {
              tmdbId: listItems[4].tmdbId,
              mediaType,
            },
          },
          create: listItems[4],
        },
      },
    },
  })
}

function removeOrphanedUserLists() {
  return prisma.userList.deleteMany({
    where: { users: { none: {} } },
  })
}

export async function createOrUpdateUserList({
  restrictions,
  listItems,
  userListId,
}: {
  restrictions: RestrictionsUI
  listItems: ListItem[]
  userListId?: number
}) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const createUpdateOperation = createOrConnectUserToList(
    user,
    restrictions,
    listItems,
    !!userListId,
  )

  let createdOrUpdatedList
  const slug = getSlug(restrictions)

  if (userListId) {
    ;[, createdOrUpdatedList] = await prisma.$transaction([
      removeUserFromList(userListId, user.id),
      createUpdateOperation,
    ])

    await removeOrphanedUserLists()

    revalidatePath(`/user/${user.username}/list/${slug}`)
    revalidatePath(`/list/${userListId}`)
  } else {
    createdOrUpdatedList = await createUpdateOperation
  }

  if (createdOrUpdatedList.createdAt !== createdOrUpdatedList.lastUserAddedAt) {
    revalidatePath(`/list/${createdOrUpdatedList.id}`)
  }

  revalidateTag(`user-mediaType-${user.id}-${restrictions.mediaType}`)

  redirect(`/user/${user.username}/list/${slug}`)
}

function removeUserFromList(userListId: number, userId: string): PrismaPromise<any> {
  return prisma.usersOnUserLists.delete({
    where: {
      userId_userListId: {
        userListId,
        userId,
      },
    },
  })
}

export async function userDeletesList(
  userListId: number,
  restrictions: RestrictionsUI,
) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  await removeUserFromList(userListId, user.id)
  await removeOrphanedUserLists()

  const slug = getSlug(restrictions)
  revalidatePath(`/user/${user.username}/list/${slug}`)
  revalidatePath(`/list/${userListId}`)
  revalidateTag(`user-mediaType-${user.id}-${restrictions.mediaType}`)

  redirect('/') // works but could be better ux
}

export async function updateUserCoverImage(coverImagePath: string) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { coverImagePath },
  })

  revalidatePath(`/user/${user.username}`)
}

export async function userListQueryServer({
  userId,
  restrictions,
  userListIdToExclude,
  sortBy,
  exactMatch,
  pageNum,
  pageSize,
}: {
  userId?: string
  restrictions: RestrictionsUI
  userListIdToExclude?: number
  sortBy: 'lastUserAddedAt' | 'users'
  exactMatch: boolean
  pageNum: number
  pageSize: number
}) {
  return userListQuery({
    userId,
    restrictions,
    userListIdToExclude,
    sortBy,
    exactMatch,
    pageSize,
    pageNum,
  })
}

export async function getRandomList() {
  // const users = await prisma.userList.count()
  // const foundUserList = await prisma.userList.findMany({
  //   take: 1,
  //   skip: Math.floor(Math.random() * (users - 1)),
  // })

  const results: any[] = await prisma.$queryRawUnsafe(
    // DO NOT pass in or accept user input here
    `SELECT * FROM "UserList" ORDER BY RANDOM() LIMIT 1;`,
  )

  if (!results.length) {
    throw new Error('No lists found')
  }

  redirect('/list/' + results[0].id)
}
