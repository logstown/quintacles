import { Suggestions } from '@/components/build-list/Suggestions'
import prisma from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { MediaType } from '@prisma/client'
import { CriteriaBreadcrumbs } from '../_components/CriteriaBreadcrumbs'
import { unstable_cache } from 'next/cache'

export default async function TvEpisodeCriteriaPage() {
  const { userId } = auth()

  if (!userId) {
    throw new Error('User not found')
  }

  const restrictions = await unstable_cache(
    () =>
      prisma.restrictions.findMany({
        where: {
          mediaType: MediaType.TvEpisode,
          userLists: {
            some: {
              users: {
                some: { userId },
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
      }),
    ['episodes-restrictions', userId, MediaType.TvEpisode],
    { tags: [`user-mediaType-${userId}-${MediaType.TvEpisode}`] },
  )()

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
