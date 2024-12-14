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
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: Promise<{ mediaTypePlural: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { mediaTypePlural } = params

  const metadata = { title: 'Create' }
  const mediaType = find(mediaTypeArr, { urlPlural: mediaTypePlural })

  if (mediaType) {
    metadata.title = `Create ${mediaType.plural} List`
  }

  return metadata
}

export default async function BuildListPage(props: {
  params: Promise<{ mediaTypePlural: string }>
  searchParams: Promise<CreateListSearchParams>
}) {
  const searchParams = await props.searchParams
  const params = await props.params

  const { mediaTypePlural } = params

  const mediaTypeObj = find(mediaTypeArr, { urlPlural: mediaTypePlural })
  if (!mediaTypeObj) {
    redirect('/')
  }

  const { userId } = await auth()

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
