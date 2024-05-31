import { CreateListSearchParams } from '@/lib/models'
import { MediaType } from '@prisma/client'
import BuildListPage from '../_components/BuildListPage'
import { getGenres } from '@/lib/genres'
import { convertMediaItem, getDecades } from '@/lib/random'
import { TmdbPerson } from '@/lib/TmdbModels'
import { getMediaItem } from '@/lib/TmdbService'
import { mediaTypes } from '@/lib/mediaTypes'
import { find } from 'lodash'

export default async function BuildMoviesListPage({
  searchParams,
}: {
  searchParams: CreateListSearchParams
}) {
  const mediaTypeGenres = getGenres(MediaType.Movie)
  const decades = getDecades()

  const isLiveActionOnly = searchParams.isLiveActionOnly === 'true'
  const genre = find(mediaTypeGenres, { id: Number(searchParams.genreId) })
  const decade = find(decades, { id: Number(searchParams.decade) })
  let Person
  if (searchParams.personId) {
    try {
      const tmdbPerson = (await getMediaItem(
        mediaTypes[MediaType.Person].key,
        Number(searchParams.personId),
      )) as TmdbPerson

      if (tmdbPerson) {
        Person = {
          id: tmdbPerson.id,
          name: tmdbPerson.name,
          profilePath: tmdbPerson.profile_path,
        }
      }
    } catch (e) {}
  }

  const restrictions = {
    decade: decade?.id ?? null,
    genreId: genre?.id ?? null,
    isLiveActionOnly: isLiveActionOnly ?? null,
    mediaType: MediaType.Movie,
    personId: Person?.id ?? null,
    Person,
    episodesTvShowId: null,
  }

  return <BuildListPage restrictions={restrictions} />
}