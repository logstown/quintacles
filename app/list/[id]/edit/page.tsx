import { BuildList } from '@/components/build-list/build-list'
import prisma from '@/lib/db'
import { RestrictionsUI } from '@/lib/models'
import { getEpisodeData } from '@/lib/random'
import { currentUser } from '@clerk/nextjs/server'
import { MediaType } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function EditListPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const user = await currentUser()

  if (!user) {
    redirect(`/list/${id}/edit`)
  }

  const list = await prisma.userList.findUnique({
    where: {
      id,
      users: { some: { id: user.id } },
    },
    include: {
      items: true,
      Restrictions: {
        include: {
          Person: true,
          EpisodesTvShow: {
            select: {
              name: true,
              backdropPath: true,
              id: true,
            },
          },
        },
      },
    },
  })

  console.log(list)

  if (!list) {
    redirect('/')
  }

  const episodeData =
    list.Restrictions.mediaType === MediaType.TvEpisode
      ? await getEpisodeData(
          Number(list.Restrictions.EpisodesTvShow.id.split('-')[1]),
        )
      : undefined

  return (
    <BuildList
      restrictions={list.Restrictions as unknown as RestrictionsUI}
      userListId={list.id}
      listItemsToEdit={list.items}
      episodeData={episodeData}
    />
  )
}
