import { CreateListSearchParams } from '@/lib/models'
import { MediaType } from '@prisma/client'
import MoviesOrShowsPage from '../_components/MoviesOrShowsPage'

export default async function MoviesBrowsePage({
  searchParams,
}: {
  searchParams: CreateListSearchParams & { sortBy: string; exactMatch: string }
}) {
  return (
    <MoviesOrShowsPage searchParams={searchParams} mediaType={MediaType.Movie} />
  )
}
