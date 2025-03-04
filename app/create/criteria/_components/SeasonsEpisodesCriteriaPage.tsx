import { Suggestions } from '@/components/build-list/Suggestions'
import prisma from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { MediaType } from '@prisma/client'
import { CriteriaBreadcrumbs } from '../_components/CriteriaBreadcrumbs'
import { unstable_cache } from 'next/cache'
import { PopularLists } from './PopularLists'

export default async function SeasonsEpisodesCriteriaPage({
  mediaType,
}: {
  mediaType: MediaType
}) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('User not found')
  }

  const restrictions = await unstable_cache(
    () =>
      prisma.restrictions.findMany({
        where: {
          mediaType,
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
            select: { id: true },
          },
        },
      }),
    ['episodes-restrictions', userId, mediaType],
    { tags: [`user-mediaType-${userId}-${mediaType}`] },
  )()

  const tvShowIds = restrictions.map(r => r.EpisodesTvShow.id)

  return (
    <>
      <CriteriaBreadcrumbs mediaType={mediaType} />
      <div className='mb-10 flex justify-center'>
        <PopularLists mediaType={mediaType} />
      </div>
      <Suggestions
        mediaType={mediaType}
        isForTvShowSelection
        mediaIds={tvShowIds}
        restrictions={{ mediaType: MediaType.TvShow }}
      />
    </>
  )
}
