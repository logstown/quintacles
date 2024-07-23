'use server'

import { TmdbGenres, TmdbPerson } from '@/lib/TmdbModels'
import { getPopularPeople, getSuggestionsTmdb } from '@/lib/TmdbService'
import prisma from '@/lib/db'
import { getGenres } from '@/lib/genres'
import { Decade, Genre, RestrictionsUI } from '@/lib/models'
import { getDecades, getSlug, getUserListsUrl } from '@/lib/random'
import { userListQuery } from '@/lib/server-functions'
import { User, auth, currentUser } from '@clerk/nextjs/server'
import { ListItem, MediaType, PrismaPromise, UserList } from '@prisma/client'
import { some } from 'lodash'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { redirect } from 'next/navigation'

export async function surpriseMe(mediaType: MediaType) {
  const { userId } = auth()

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
  const decades = getDecades()
  const genres = getGenres(mediaType)

  const getRandomInt = (max: number, min?: number): number => {
    min = min || 0

    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  }

  const alreadyExists = (
    genre: Genre | undefined,
    decade: Decade | undefined,
    moviePerson: TmdbPerson | undefined,
    isLiveActionOnly: boolean,
  ) =>
    some(
      userRestrictionsArr,
      restrictions =>
        restrictions.genreId === (genre?.id ?? 0) &&
        restrictions.decade === (decade?.id ?? 0) &&
        restrictions.personId === (moviePerson?.id ?? 0) &&
        restrictions.isLiveActionOnly === isLiveActionOnly,
    )

  let genre: Genre | undefined,
    decade: Decade | undefined,
    moviePerson: TmdbPerson | undefined,
    isLiveActionOnly: boolean
  do {
    genre = undefined
    decade = undefined
    moviePerson = undefined
    isLiveActionOnly = false

    if (Math.random() <= 0.4) {
      genre = genres[getRandomInt(genres.length)]
    }

    if (Math.random() <= 0.2) {
      decade = decades[getRandomInt(decades.length)]
    }

    if (popularPeople.length && (!genre || !decade) && Math.random() <= 0.15) {
      const { id, name, profile_path } =
        popularPeople[getRandomInt(popularPeople.length)]
      moviePerson = { id, name, profile_path }
    }

    if (genre?.id !== TmdbGenres.Animation && Math.random() < 0.15) {
      isLiveActionOnly = true
    }
  } while (
    (!genre && !decade && !moviePerson && !isLiveActionOnly) ||
    alreadyExists(genre, decade, moviePerson, isLiveActionOnly)
  )

  const buildURL = getUserListsUrl(
    {
      mediaType,
      genreId: genre?.id ?? 0,
      decade: decade?.id ?? 0,
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
  let { mediaType, decade, isLiveActionOnly, genreId, Person, EpisodesTvShow } =
    restrictions

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

  decade = decade ?? 0
  genreId = genreId ?? 0
  isLiveActionOnly = isLiveActionOnly ?? false

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
            decade,
            isLiveActionOnly,
            genreId,
            Person: {
              connectOrCreate: {
                where: { id: Person.id },
                create: Person,
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
  sortBy,
  exactMatch,
  pageNum,
  pageSize,
}: {
  userId?: string
  restrictions: RestrictionsUI
  sortBy: 'lastUserAddedAt' | 'users'
  exactMatch: boolean
  pageNum: number
  pageSize: number
}) {
  return userListQuery({
    userId,
    restrictions,
    sortBy,
    exactMatch,
    pageSize,
    pageNum,
  })
}
