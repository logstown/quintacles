import { Suggestions } from '@/components/build-list/Suggestions'
import prisma from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { MediaType } from '@prisma/client'
import { CriteriaBreadcrumbs } from '../_components/CriteriaBreadcrumbs'

export default async function TvEpisodeCriteriaPage() {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

  const restrictions = await prisma.restrictions.findMany({
    where: {
      mediaType: MediaType.TvEpisode,
      userLists: {
        some: {
          users: {
            some: { userId: user.id },
          },
        },
      },
    },
    select: {
      EpisodesTvShow: {
        select: {
          id: true,
        },
      },
    },
  })

  const tvShowIds = restrictions.map(r => r.EpisodesTvShow.id)

  return (
    <>
      <CriteriaBreadcrumbs mediaType={MediaType.TvEpisode} />
      <Suggestions
        isForEpisodes={true}
        mediaIds={tvShowIds}
        restrictions={{ mediaType: MediaType.TvShow }}
      />
    </>
  )
}
