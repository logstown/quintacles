import { title } from '@/components/primitives'
import { MovieTvCriteriaBuild } from '../_components/move-tv-criteria-page'
import { MediaType } from '@prisma/client'

export default function MoviesCriteriaPage() {
  return <MovieTvCriteriaBuild mediaType={MediaType.Movie} />
}
