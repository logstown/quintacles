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

  const possibleDupe = await prisma.userList.findFirst({
    where: {
      users: {
        some: { id: user.id },
      },
      Restrictions: { slug },
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
