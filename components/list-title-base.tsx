import { replace, trim } from 'lodash'
import { useMemo } from 'react'
import { getGenreById } from '../lib/genres'
import { mediaTypes } from '../lib/mediaTypes'
import { RestrictionsUI } from '@/lib/models'
import { getTmdbImageUrl } from '@/lib/random'
import { Restrictions } from '@prisma/client'

export const getListTitle = ({
  restrictions,
  isDetailView,
  isForSlug,
  tvShowLogoFilePath,
  includeTopFive,
}: {
  restrictions: RestrictionsUI
  isDetailView?: boolean
  isForSlug?: boolean
  tvShowLogoFilePath?: string
  includeTopFive?: boolean
}): string => {
  const {
    mediaType,
    year,
    Person,
    isLiveActionOnly,
    genreId,
    episodesTvShowId,
    EpisodesTvShow,
    Network,
  } = restrictions

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
        : `<img style="max-height: 175px;" class="drop-shadow-2xl dark:rounded-xl dark:bg-white dark:p-1" src='${getTmdbImageUrl(Network.logoPath, 'w500')}'> `
  }

  if (genreId) {
    title += `${getGenreById(genreId)?.name} `
  }

  if (includeTopFive || (!trim(title) && !episodesTvShowId)) {
    title += 'Top Five '
  }

  if (EpisodesTvShow?.name) {
    title += tvShowLogoFilePath
      ? `<img style="max-height: 175px;" class="drop-shadow-xl" src='${getTmdbImageUrl(tvShowLogoFilePath, 'w500')}'> `
      : `${EpisodesTvShow.name} `
  }

  if (isDetailView) {
    const replaced = episodesTvShowId ? 'TV' : ''
    const plural = replace(mediaTypes[mediaType].plural, replaced, '')
    title += plural
  }

  return title
}

export const getMetaDataListTitle = (restrictions: Restrictions): string => {
  return getListTitle({
    restrictions,
    isDetailView: true,
    isForSlug: true,
    includeTopFive: true,
  })
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
    return getListTitle({
      restrictions,
      isDetailView: includeMediaType,
      tvShowLogoFilePath,
    })
  }, [restrictions, includeMediaType])

  return (
    <span
      dangerouslySetInnerHTML={{ __html: partialTitle }}
      className='flex flex-col items-center gap-6'
    ></span>
  )
}
