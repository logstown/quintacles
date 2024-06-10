import { CreateListSearchParams } from '@/lib/models'
import { MediaType } from '@prisma/client'
import { getGenres } from '@/lib/genres'
import { getDecades } from '@/lib/random'
import { TmdbPerson } from '@/lib/TmdbModels'
import { getMediaItem } from '@/lib/TmdbService'
import { mediaTypes } from '@/lib/mediaTypes'
import { find } from 'lodash'
import { BrowsePage } from '../_components/BrowsePage'
import { ListTitle } from '@/app/create/criteria/_components/list-title'
import { ListTitleBase } from '@/components/list-title-base'
import { UserListQuery } from '@/components/UserListQuery'
import { Suspense } from 'react'
import { UserListSkeleton } from '@/components/user-list/UserListSkeleton'

export default async function BuildMoviesListPage({
  searchParams,
}: {
  searchParams: CreateListSearchParams & { sortBy: string; exactMatch: string }
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
    decade: decade?.id,
    genreId: genre?.id,
    isLiveActionOnly,
    mediaType: MediaType.Movie,
    personId: Person?.id,
    Person,
  }

  const sortBy =
    searchParams.sortBy === 'lastUserAddedAt' || searchParams.sortBy === 'users'
      ? searchParams.sortBy
      : 'lastUserAddedAt'
  const exactMatch = searchParams.exactMatch == 'true'

  console.log(sortBy)

  return (
    <div className='mx-auto flex max-w-screen-lg flex-col gap-10 pb-20  pt-10'>
      <BrowsePage
        restrictionsFromParent={restrictions}
        sortBy={sortBy}
        exactMatch={exactMatch}
      />
      {exactMatch && (
        <ListTitle mediaType={restrictions.mediaType}>
          <ListTitleBase restrictions={restrictions} />
        </ListTitle>
      )}
      <Suspense
        fallback={
          <div className={`flex flex-col gap-5`}>
            {[1, 2, 3, 4].map(i => (
              <UserListSkeleton key={i} isEpisodes={false} />
            ))}{' '}
          </div>
        }
      >
        <UserListQuery
          restrictions={restrictions}
          sortBy={sortBy}
          exactMatch={exactMatch}
        />
      </Suspense>
    </div>
  )
}
