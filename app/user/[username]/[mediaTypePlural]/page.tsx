import MoviesOrShowsPage from '@/app/browse/_components/MoviesOrShowsPage'
import EpisodesBrowsePage from '@/app/browse/episodes/page'
import prisma from '@/lib/db'
import { mediaTypeArr } from '@/lib/mediaTypes'
import { CreateListSearchParams } from '@/lib/models'
import { MediaType } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function UserMediaTypeLists({
  params: { username, mediaTypePlural },
  searchParams,
}: {
  params: { username: string; mediaTypePlural: string }
  searchParams: CreateListSearchParams & { sortBy: string; exactMatch: string } & {
    tvShowId: string
  }
}) {
  const mediaType = mediaTypeArr.find(
    mediaType => mediaType.urlPlural === mediaTypePlural,
  )
  if (!mediaType) {
    redirect(`/`)
  }

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    redirect('/')
  }

  return mediaType.key === MediaType.TvEpisode ? (
    <EpisodesBrowsePage searchParams={searchParams} user={user} />
  ) : (
    <MoviesOrShowsPage
      searchParams={searchParams}
      mediaType={mediaType.key}
      user={user}
    />
  )
}
