'use server'

import { TmdbGenres, TmdbPerson } from '@/lib/TmdbModels'
import { getPopularPeople, getSuggestionsTmdb } from '@/lib/TmdbService'
import prisma from '@/lib/db'
import { getGenres } from '@/lib/genres'
import { Decade, Genre, RestrictionsUI } from '@/lib/models'
import { getDecades, getUserListsUrl } from '@/lib/random'
import { currentUser } from '@clerk/nextjs/server'
import { ListItem, MediaType, PrismaPromise, UserList } from '@prisma/client'
import { reduce, some } from 'lodash'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function surpriseMe(mediaType: MediaType) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const userRestrictionsArr = await prisma.restrictions.findMany({
    where: {
      userLists: {
        some: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      },
    },
  })

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
        restrictions.genreId === genre?.id &&
        restrictions.decade === decade?.id &&
        restrictions.personId === moviePerson?.id &&
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
      episodesTvShowId: '',
    },
    'build',
  )

  redirect(buildURL)

  return userRestrictionsArr
}

export async function getSuggestions(
  pageNum: number,
  restrictions: RestrictionsUI,
) {
  const res = await getSuggestionsTmdb(pageNum, restrictions)
  return res
}

function createOrConnectUserToList(
  userId: string,
  restrictionsId: number,
  listItems: ListItem[],
): PrismaPromise<UserList> {
  const orderedItemIdsString = reduce(
    listItems,
    (str, item, i) => {
      str += item.id.split('-')[1]
      if (i < listItems.length - 1) {
        str += '-'
      }

      return str
    },
    '',
  )

  return prisma.userList.upsert({
    where: {
      uniqueList: {
        orderedItemIdsString,
        restrictionsId,
      },
    },
    update: {
      users: {
        connect: { id: userId },
      },
      lastUserAddedAt: new Date(),
    },
    create: {
      orderedItemIdsString,
      users: {
        connect: { id: userId },
      },
      Restrictions: {
        connect: { id: restrictionsId },
      },
      items: {
        connectOrCreate: listItems.map(item => ({
          where: { id: item.id },
          create: item,
        })),
      },
    },
  })
}

export async function createList(
  {
    genreId,
    decade,
    mediaType,
    isLiveActionOnly,
    Person,
    EpisodesTvShow,
  }: RestrictionsUI,
  listItems: ListItem[],
) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }
  Person = Person ?? {
    id: 0,
    name: '',
    profilePath: null,
  }

  EpisodesTvShow = EpisodesTvShow ?? {
    id: '',
    mediaType,
    name: '',
    genreIds: [],
    date: '',
    posterPath: null,
    overview: null,
    backdropPath: null,
    seasonNum: null,
    episodeNum: null,
  }

  const { id: restrictionsId } = await prisma.restrictions.upsert({
    where: {
      uniqueRestrictions: {
        mediaType,
        genreId: genreId ?? 0,
        decade: decade ?? 0,
        isLiveActionOnly,
        personId: Person.id,
        episodesTvShowId: EpisodesTvShow.id,
      },
    },
    update: {},
    create: {
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
      mediaType,
      genreId: genreId ?? 0,
      decade: decade ?? 0,
      isLiveActionOnly,
    },
  })

  const { id: listId } = await createOrConnectUserToList(
    user.id,
    restrictionsId,
    listItems,
  )

  redirect(`/list/${listId}`)
}

export async function updateList(
  restrictionsId: number,
  listItems: ListItem[],
  userListId: string,
) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const removeUserOperation = prisma.userList.update({
    where: {
      id: userListId,
    },
    data: {
      users: {
        disconnect: { id: user.id },
      },
    },
  })

  return prisma.$transaction([
    removeUserOperation,
    createOrConnectUserToList(user.id, restrictionsId, listItems),
  ])
}

// TODO: this will leave an orphaned list if the last user is removed
export async function removeUserFromList(userListId: string) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  return prisma.userList.update({
    where: {
      id: userListId,
    },
    data: {
      users: {
        disconnect: { id: user.id },
      },
    },
  })
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
