import { currentUser } from '@clerk/nextjs/server'
import { RestrictionsUI } from '@/lib/models'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { BuildList } from '@/components/build-list/build-list'
import { EpisodeData } from '@/lib/random'

export default async function BuildListPage({
  restrictions,
  episodeData,
}: {
  restrictions: RestrictionsUI
  episodeData?: EpisodeData
}) {
  const user = await currentUser()

  if (!user) {
    throw new Error('User not found')
  }

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

  return <BuildList restrictions={restrictions} episodeData={episodeData} />
}
