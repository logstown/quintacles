import { replace, trim } from 'lodash'
import { useMemo } from 'react'
import { getGenreById } from '../lib/genres'
import { mediaTypes } from '../lib/mediaTypes'
import { RestrictionsUI } from '@/lib/models'

export const getListTitle = (
  isDetailView: boolean = false,
  {
    mediaType,
    year,
    Person,
    isLiveActionOnly,
    genreId,
    episodesTvShowId,
    EpisodesTvShow,
    Network,
  }: RestrictionsUI,
  isForSlug?: boolean,
): string => {
  let title = ''

  if (year) {
    title += year > 10000 ? `${year / 10}s ` : `${year} `
  }

  if (Person?.name) {
    title += `${Person.name} `
  }

  if (isLiveActionOnly) {
    title += 'Live-Action '
  }

  if (Network?.name) {
    title += `${Network.name} `
  }

  if (genreId) {
    title += `${getGenreById(genreId)?.name} `
  }

  if (!trim(title) && !episodesTvShowId) {
    title += 'Top Five '
  }

  if (isForSlug && EpisodesTvShow?.name) {
    title += `${EpisodesTvShow.name} `
  }

  if (isDetailView) {
    const replaced = episodesTvShowId ? 'TV' : ''
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
    return getListTitle(includeMediaType, restrictions)
  }, [restrictions, includeMediaType])

  const tvShow = restrictions.EpisodesTvShow?.name

  return (
    <>
      {tvShow && (
        <span className={includeMediaType ? 'mr-2 italic' : ''}>{tvShow}</span>
      )}
      {'  '}
      {partialTitle}
    </>
  )
}
