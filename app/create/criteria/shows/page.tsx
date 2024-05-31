import { title } from '@/components/primitives'
import { MovieTvCriteriaBuild } from '../_components/move-tv-criteria-page'
import { MediaType } from '@prisma/client'

export default function ShowsCriteriaPage() {
  return <MovieTvCriteriaBuild mediaType={MediaType.TvShow} />
}
