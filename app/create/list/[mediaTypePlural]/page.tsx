import { currentUser } from '@clerk/nextjs/server'
import { CreateListSearchParams } from '@/lib/models'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { BuildList } from '@/components/build-list/build-list'
import { EpisodeData, getEpisodeData, getSlug } from '@/lib/random'
import { find } from 'lodash'
import { mediaTypeArr } from '@/lib/mediaTypes'
import { MediaType } from '@prisma/client'
import { getRestrictionsFromParams } from '@/lib/server-functions'
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

  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const restrictions = await getRestrictionsFromParams({
    mediaType: mediaTypeObj.key,
    searchParams,
  })

  const slug = getSlug(restrictions)

  const dupe = await prisma.usersOnUserLists.findUnique({
    where: {
      userRestrictionsById: {
        userId: user.id,
        restrictionsSlug: slug,
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
      <div className='mb-10'>
        <CriteriaBreadcrumbs mediaType={restrictions.mediaType} isAddItems />
      </div>
      <BuildList restrictions={restrictions} episodeData={episodeData} />
    </>
  )
}
