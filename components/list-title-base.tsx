import { replace, trim } from 'lodash'
import { useMemo } from 'react'
import { getGenreById } from '../lib/genres'
import { mediaTypes } from '../lib/mediaTypes'
import { RestrictionsUI } from '@/lib/models'
import { getTmdbImageUrl } from '@/lib/random'

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
  tvShowLogoFilePath?: string,
  includeTopFive?: boolean,
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

  if (Network?.id) {
    title +=
      isForSlug || !isDetailView
        ? `${Network.name} `
        : `<img style="max-height: 100px;" class="drop-shadow-2xl" src='${getTmdbImageUrl(Network.logoPath, 'w300')}'> `
  }

  if (genreId) {
    title += `${getGenreById(genreId)?.name} `
  }

  if (includeTopFive || (!trim(title) && !episodesTvShowId)) {
    title += 'Top Five '
  }

  if (EpisodesTvShow?.name) {
    title += tvShowLogoFilePath
      ? `<img style="max-height: 100px;" class="drop-shadow-xl" src='${getTmdbImageUrl(tvShowLogoFilePath, 'w300')}'> `
      : `${EpisodesTvShow.name} `
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
  tvShowLogoFilePath,
}: {
  restrictions: RestrictionsUI
  includeMediaType?: boolean
  tvShowLogoFilePath?: string
}) {
  const partialTitle = useMemo(() => {
    return getListTitle(includeMediaType, restrictions, false, tvShowLogoFilePath)
  }, [restrictions, includeMediaType])

  return (
    <span
      dangerouslySetInnerHTML={{ __html: partialTitle }}
      className='flex flex-wrap items-baseline justify-center gap-6'
    ></span>
  )
}
