import { omit } from 'lodash'
import { currentUser } from '@clerk/nextjs/server'
import { RestrictionsUI } from '@/lib/models'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { BuildList } from '@/components/build-list/build-list'
import { EpisodeData } from '../episodes/[tvShowId]/page'

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

  const possibleDupe = await prisma.userList.findFirst({
    where: {
      users: {
        some: { id: user.id },
      },
      Restrictions: { is: omit(restrictions, 'Person', 'EpisodesTvShow') },
    },
  })

  if (possibleDupe) {
    redirect(`/list/${possibleDupe.id}/edit`)
  }

  return (
    <main className='container mb-12 mt-6 flex flex-col gap-8'>
      <BuildList restrictions={restrictions} episodeData={episodeData} />
    </main>
  )
}