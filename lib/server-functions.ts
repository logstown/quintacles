import 'server-only'

import { find, pickBy, reject } from 'lodash'
import {
  CreateListSearchParams,
  EpisodeData,
  RestrictionsUI,
  TvShowLiteUI,
} from './models'
import { MediaType, Prisma } from '@prisma/client'
import prisma from './db'
import { redirect } from 'next/navigation'
import { TmdbPerson, TvEpisode, Season, TvShowDetails } from './TmdbModels'
import { getMediaItem, getNetwork, getTvSeason } from './TmdbService'
import { getGenres } from './genres'
import { mediaTypes } from './mediaTypes'
import { convertMediaItem, getSlug, getYears } from './random'
import { flow, map, sortBy, uniq } from 'lodash/fp'
import { unstable_cache } from 'next/cache'
import { networks } from './networks'

export async function userListQuery({
  userId,
  exactMatch = false,
  restrictions,
  userListIdToExclude,
  sortBy = 'lastUserAddedAt',
  pageSize = 5,
  pageNum = 1,
}: {
  restrictions: RestrictionsUI
  userListIdToExclude?: number
  userId?: string
  exactMatch?: boolean
  sortBy: 'lastUserAddedAt' | 'users'
  pageSize: number
  pageNum: number
}) {
  const users = userId
    ? {
        some: { userId },
      }
    : {
        some: {},
      }

  const slug = getSlug(restrictions)
  const Restrictions = exactMatch ? { slug } : { is: pickBy(restrictions, v => v) }

  const orderBy =
    sortBy === 'lastUserAddedAt'
      ? { lastUserAddedAt: Prisma.SortOrder.desc }
      : {
          users: { _count: Prisma.SortOrder.desc },
        }

  const itemSelect = {
    select: {
      name: true,
      posterPath: true,
      backdropPath: true,
    },
  }

  const lists = await unstable_cache(
    async () =>
      prisma.userList.findMany({
        where: {
          users,
          Restrictions,
          id: { not: userListIdToExclude },
        },
        take: pageSize,
        skip: pageNum * pageSize,
        orderBy,
        include: {
          users: {
            include: {
              User: true,
            },
          },
          item1: itemSelect,
          item2: itemSelect,
          item3: itemSelect,
          item4: itemSelect,
          item5: itemSelect,
          Restrictions: {
            include: {
              Person: true,
              EpisodesTvShow: true,
              Network: true,
            },
          },
        },
      }),
    [
      'userlist-query',
      userId ?? '',
      slug,
      userListIdToExclude?.toString() ?? '',
      sortBy,
      exactMatch.toString(),
      pageSize.toString(),
      pageNum.toString(),
    ],
    {
      revalidate: 30,
      tags: ['userlist-query', `user-mediaType-${userId}-${restrictions.mediaType}`],
    },
  )()

  return lists.map(list => ({
    ...list,
    users: list.users.map(u => u.User),
  }))
}

export async function getRestrictionsFromParams({
  mediaType,
  searchParams,
}: {
  mediaType: MediaType
  searchParams: CreateListSearchParams
}): Promise<RestrictionsUI> {
  'server only'

  if (mediaType === MediaType.TvEpisode || mediaType === MediaType.TvSeason) {
    const tvShowId = Number(searchParams.episodesTvShowId)
    let EpisodesTvShow
    try {
      const tmdbShow = (await getMediaItem(
        mediaTypes[MediaType.TvShow].key,
        tvShowId,
      )) as TvShowDetails

      if (tmdbShow) {
        EpisodesTvShow = {
          id: tmdbShow.id,
          name: tmdbShow.name,
          posterPath: tmdbShow.poster_path,
          backdropPath: tmdbShow.backdrop_path,
        } as TvShowLiteUI

        if (mediaType === MediaType.TvSeason) {
          EpisodesTvShow.seasons = tmdbShow.seasons
            .filter(season => season.season_number > 0)
            .filter(
              season => season.air_date && new Date(season.air_date) < new Date(),
            )
            .map(season => convertMediaItem(season, mediaType))
        }
      }
    } catch (e) {}

    if (!EpisodesTvShow) {
      console.warn('EpisodesTvShow not found')
      redirect('/')
    }

    return {
      mediaType,
      episodesTvShowId: EpisodesTvShow.id,
      EpisodesTvShow,
    }
  } else {
    const mediaTypeGenres = getGenres(mediaType)
    const years = getYears()

    const isLiveActionOnly = searchParams.isLiveActionOnly === 'true'
    const genre = find(mediaTypeGenres, { id: Number(searchParams.genreId) })
    const year = find(years, { id: Number(searchParams.year) })
    const Network = find(networks, { id: Number(searchParams.networkId) })
    if (Network && mediaType === MediaType.TvShow) {
      try {
        const tmdbNetwork = await getNetwork(Network.id)
        Network.logoPath = tmdbNetwork.logo_path
      } catch (e) {}
    }

    let Person
    if (mediaType === MediaType.Movie && searchParams.personId) {
      try {
        const tmdbPerson = (await getMediaItem(
          mediaTypes[MediaType.Person].key,
          Number(searchParams.personId),
        )) as TmdbPerson

        if (tmdbPerson) {
          Person = {
            id: tmdbPerson.id,
            name: tmdbPerson.name,
            profilePath: tmdbPerson.profile_path,
          }
        }
      } catch (e) {}
    }

    return {
      year: year?.id,
      genreId: genre?.id,
      networkId: Network?.id,
      Network,
      isLiveActionOnly,
      mediaType,
      personId: Person?.id,
      Person,
    }
  }
}

const fetchAllEpisodes = async (
  showId: number,
  seasonNum: number,
): Promise<TvEpisode[]> => {
  const season = (await getTvSeason(showId, seasonNum)) as Season & {
    success: boolean
  }

  if (season.success === false) {
    return []
  } else {
    const episodes = reject(
      season.episodes,
      ep => new Date(ep.air_date) > new Date(),
    )
    const nextSeasonEps = await fetchAllEpisodes(showId, seasonNum + 1)
    return [...episodes, ...nextSeasonEps]
  }
}

export const getEpisodeData = async (tvShowId: number): Promise<EpisodeData> => {
  const allEpisodes = await fetchAllEpisodes(tvShowId, 1)
  const seasons = flow(
    map('season_number'),
    map(x => x.toString()),
    uniq,
    sortBy(x => Number(x)),
  )(allEpisodes)

  return { allEpisodes, seasons }
}
