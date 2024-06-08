import { BuildList } from '@/components/build-list/build-list'
import prisma from '@/lib/db'
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
      item1: true,
      item2: true,
      item3: true,
      item4: true,
      item5: true,
      Restrictions: {
        include: {
          Person: true,
          EpisodesTvShow: true,
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
      ? await getEpisodeData(list.Restrictions.EpisodesTvShow.id)
      : undefined

  return (
    <BuildList
      restrictions={list.Restrictions}
      userListId={list.id}
      listItemsToEdit={[list.item1, list.item2, list.item3, list.item4, list.item5]}
      episodeData={episodeData}
    />
  )
}
