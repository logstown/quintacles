import { EpisodesTvShowPicker } from './_components/EpisodesTvShowPicker'
import prisma from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { MediaType } from '@prisma/client'

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
            some: { id: user.id },
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

  return <EpisodesTvShowPicker tvShowIds={tvShowIds} />
}
