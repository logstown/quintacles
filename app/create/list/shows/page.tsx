import { CreateListSearchParams } from '@/lib/models'
import { MediaType } from '@prisma/client'
import BuildListPage from '../_components/BuildListPage'
import { getGenres } from '@/lib/genres'
import { getDecades } from '@/lib/random'
import { find } from 'lodash'

export default async function BuildShowsListPage({
  searchParams,
}: {
  searchParams: CreateListSearchParams
}) {
  const mediaTypeGenres = getGenres(MediaType.TvShow)
  const decades = getDecades()

  const isLiveActionOnly = searchParams.isLiveActionOnly === 'true'
  const genre = find(mediaTypeGenres, { id: Number(searchParams.genreId) })
  const decade = find(decades, { id: Number(searchParams.decade) })

  const restrictions = {
    decade: decade?.id ?? null,
    genreId: genre?.id ?? null,
    isLiveActionOnly: isLiveActionOnly ?? null,
    mediaType: MediaType.TvShow,
    personId: null,
    episodesTvShowId: null,
  }

  return <BuildListPage restrictions={restrictions} />
}
