import { currentUser } from '@clerk/nextjs/server'
import { CreateListSearchParams, RestrictionsUI } from '@/lib/models'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { BuildList } from '@/components/build-list/build-list'
import { EpisodeData, getDecades, getEpisodeData } from '@/lib/random'
import { find } from 'lodash'
import { mediaTypeArr, mediaTypes } from '@/lib/mediaTypes'
import { MediaType } from '@prisma/client'
import { getGenres } from '@/lib/genres'
import { getMediaItem } from '@/lib/TmdbService'
import { TmdbPerson, TvShow } from '@/lib/TmdbModels'

export default async function BuildListPage({
  params: { mediaTypePlural },
  searchParams,
}: {
  params: { mediaTypePlural: string }
  searchParams: CreateListSearchParams
}) {
  const mediaTypeObj = find(mediaTypeArr, { urlPlural: mediaTypePlural })
  if (!mediaTypeObj) {
    redirect('/')
  }

  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const restrictions = await getRestrictionsFromParams({
    mediaType: mediaTypeObj.key,
    searchParams,
  })

  const restictionsForQuery = {
    decade: restrictions.decade ?? 0,
    genreId: restrictions.genreId ?? 0,
    isLiveActionOnly: restrictions.isLiveActionOnly,
    mediaType: restrictions.mediaType,
    personId: restrictions.personId ?? 0,
    episodesTvShowId: restrictions.episodesTvShowId ?? 0,
  }

  const possibleDupe = await prisma.userList.findFirst({
    where: {
      users: {
        some: { id: user.id },
      },
      Restrictions: { is: restictionsForQuery },
    },
  })

  if (possibleDupe) {
    redirect(`/list/${possibleDupe.id}/edit`)
  }

  let episodeData: EpisodeData | undefined
  if (restrictions.mediaType === MediaType.TvEpisode) {
    episodeData = await getEpisodeData(restrictions.episodesTvShowId!)
  }

  return <BuildList restrictions={restrictions} episodeData={episodeData} />
}

async function getRestrictionsFromParams({
  mediaType,
  searchParams,
}: {
  mediaType: MediaType
  searchParams: CreateListSearchParams
}): Promise<RestrictionsUI> {
  if (mediaType === MediaType.TvEpisode) {
    const tvShowId = Number(searchParams.episodesTvShowId)
    let EpisodesTvShow
    try {
      const tmdbShow = (await getMediaItem(
        mediaTypes[MediaType.TvShow].key,
        tvShowId,
      )) as TvShow

      if (tmdbShow) {
        EpisodesTvShow = {
          id: tmdbShow.id,
          name: tmdbShow.name,
          posterPath: tmdbShow.poster_path,
        }
      }
    } catch (e) {}

    if (!EpisodesTvShow) {
      console.warn('EpisodesTvShow not found')
      redirect('/')
    }

    return {
      mediaType: MediaType.TvEpisode,
      episodesTvShowId: EpisodesTvShow.id,
      EpisodesTvShow,
    }
  } else {
    const mediaTypeGenres = getGenres(mediaType)
    const decades = getDecades()

    const isLiveActionOnly = searchParams.isLiveActionOnly === 'true'
    const genre = find(mediaTypeGenres, { id: Number(searchParams.genreId) })
    const decade = find(decades, { id: Number(searchParams.decade) })
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
      decade: decade?.id,
      genreId: genre?.id,
      isLiveActionOnly,
      mediaType,
      personId: Person?.id,
      Person,
    }
  }
}
