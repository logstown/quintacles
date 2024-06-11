import { CreateListSearchParams } from '@/lib/models'
import { MediaType, User } from '@prisma/client'
import { getGenres } from '@/lib/genres'
import { getDecades } from '@/lib/random'
import { TmdbPerson } from '@/lib/TmdbModels'
import { getMediaItem } from '@/lib/TmdbService'
import { mediaTypes } from '@/lib/mediaTypes'
import { find } from 'lodash'
import BrowsePage from './BrowsePage'

export default async function MoviesOrShowsPage({
  searchParams,
  mediaType,
  user,
}: {
  searchParams: CreateListSearchParams & { sortBy: string; exactMatch: string }
  mediaType: MediaType
  user?: User
}) {
  const mediaTypeGenres = getGenres(mediaType)
  const decades = getDecades()

  const isLiveActionOnly = searchParams.isLiveActionOnly === 'true'
  const genre = find(mediaTypeGenres, { id: Number(searchParams.genreId) })
  const decade = find(decades, { id: Number(searchParams.decade) })
  let Person
  if (mediaType === MediaType.Movie && searchParams.personId) {
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
    decade: decade?.id,
    genreId: genre?.id,
    isLiveActionOnly,
    mediaType,
    personId: Person?.id,
    Person,
  }

  console.log(user)

  return (
    <BrowsePage
      restrictions={restrictions}
      user={user}
      searchParams={searchParams}
    />
  )
}
