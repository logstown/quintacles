import EpisodesBrowse from '@/app/browse/_components/EpisodesPage'
import MoviesOrShowsPage from '@/app/browse/_components/MoviesOrShowsPage'
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
    <EpisodesBrowse searchParams={searchParams} user={user} />
  ) : (
    <MoviesOrShowsPage
      searchParams={searchParams}
      mediaType={mediaType.key}
      user={user}
    />
  )
}
