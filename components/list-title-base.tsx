import { replace, trim } from 'lodash'
import { useMemo } from 'react'
import { getGenreById } from '../lib/genres'
import { mediaTypes } from '../lib/mediaTypes'
import { MediaType } from '@prisma/client'
import { RestrictionsUI } from '@/lib/models'

const getListTitle = (
  isDetailView: boolean = false,
  isEpisodes: boolean = false,
  { mediaType, decade, Person, isLiveActionOnly, genreId }: RestrictionsUI,
): string => {
  let title = ''

  if (decade) {
    title += `${decade}s `
  }

  if (Person && Person.id !== 0) {
    title += `${Person.name} `
  }

  if (isLiveActionOnly) {
    title += 'Live-Action '
  }

  if (genreId) {
    title += `${getGenreById(genreId)?.name} `
  }

  if (!trim(title) && !isEpisodes) {
    title += 'Top Five '
  }

  if (isDetailView) {
    const replaced = isEpisodes ? 'TV' : ''
    const plural = replace(mediaTypes[mediaType].plural, replaced, '')
    title += plural
  }

  return title
}

export function ListTitleBase({
  restrictions,
  includeMediaType,
}: {
  restrictions: RestrictionsUI
  includeMediaType?: boolean
}) {
  const partialTitle = useMemo(() => {
    const isEpisodes = restrictions.mediaType === MediaType.TvEpisode
    return getListTitle(includeMediaType, isEpisodes, restrictions)
  }, [restrictions])

  const tvShow = restrictions.EpisodesTvShow?.name

  return (
    <>
      {tvShow && <span className='italic'>{tvShow}</span>} {partialTitle}
    </>
  )
}
