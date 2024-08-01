import { BuildList } from '@/components/build-list/build-list'
import prisma from '@/lib/db'
import { getEpisodeData } from '@/lib/server-functions'
import { auth } from '@clerk/nextjs/server'
import { MediaType } from '@prisma/client'
import { notFound, redirect } from 'next/navigation'

export const metadata = {
  title: 'Edit List',
}

export default async function EditListPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const { userId } = auth()

  if (!userId) {
    redirect(`/list/${id}`)
  }

  const list = await prisma.userList.findUnique({
    where: {
      id: Number(id),
      users: {
        some: { userId },
      },
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

  if (!list) {
    notFound()
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
