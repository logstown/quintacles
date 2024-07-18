import { auth } from '@clerk/nextjs/server'
import { CreateListSearchParams, EpisodeData } from '@/lib/models'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { BuildList } from '@/components/build-list/build-list'
import { getSlug } from '@/lib/random'
import { cloneDeep, find } from 'lodash'
import { mediaTypeArr } from '@/lib/mediaTypes'
import { MediaType } from '@prisma/client'
import { getEpisodeData, getRestrictionsFromParams } from '@/lib/server-functions'
import { CriteriaBreadcrumbs } from '../../criteria/_components/CriteriaBreadcrumbs'

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

  const { userId } = auth()

  if (!userId) {
    throw new Error('User not found')
  }

  const restrictions = await getRestrictionsFromParams({
    mediaType: mediaTypeObj.key,
    searchParams,
  })
  const seasons = cloneDeep(restrictions.EpisodesTvShow?.seasons)
  delete restrictions.EpisodesTvShow?.seasons

  const restrictionsSlug = getSlug(restrictions)

  const dupe = await prisma.usersOnUserLists.findUnique({
    where: {
      userRestrictionsById: {
        userId,
        restrictionsSlug,
      },
    },
  })

  if (dupe) {
    redirect(`/list/${dupe.userListId}/edit`)
  }

  let episodeData: EpisodeData | undefined
  if (restrictions.mediaType === MediaType.TvEpisode) {
    episodeData = await getEpisodeData(restrictions.episodesTvShowId!)
  }

  return (
    <>
      <CriteriaBreadcrumbs mediaType={restrictions.mediaType} isAddItems />
      <BuildList
        seasons={seasons}
        restrictions={restrictions}
        episodeData={episodeData}
      />
    </>
  )
}
