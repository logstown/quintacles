import { mediaTypes } from '@/lib/mediaTypes'
import { ListItem, MediaType } from '@prisma/client'
import Link from 'next/link'

export function ListItemLink({
  mediaType,
  tvShowId,
  item,
  children,
}: {
  mediaType: MediaType
  tvShowId: number
  item: ListItem
  children: React.ReactNode
}) {
  const href = getTmdbHref({ mediaType, tvShowId, item })

  return (
    <Link href={href} target='_blank'>
      {children}
    </Link>
  )
}

const getTmdbHref = ({
  mediaType,
  tvShowId,
  item,
}: {
  mediaType: MediaType
  tvShowId: number
  item: ListItem
}) => {
  const baseUrl = `https://www.themoviedb.org`

  switch (mediaType) {
    case MediaType.TvSeason:
      return `${baseUrl}/${mediaTypes[MediaType.TvShow].url}/${tvShowId}/season/${item.seasonNum}`
    case MediaType.TvEpisode:
      return `${baseUrl}/${mediaTypes[MediaType.TvShow].url}/${tvShowId}/season/${item.seasonNum}/episode/${item.episodeNum}`
    default:
      return `${baseUrl}/${mediaTypes[mediaType].url}/${item.tmdbId}`
  }
}
