import { currentUser } from '@clerk/nextjs/server'
import { CreateListSearchParams } from '@/lib/models'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { BuildList } from '@/components/build-list/build-list'
import { EpisodeData, getEpisodeData, getRestrictionsFromParams } from '@/lib/random'
import { find } from 'lodash'
import { mediaTypeArr } from '@/lib/mediaTypes'
import { MediaType } from '@prisma/client'

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
