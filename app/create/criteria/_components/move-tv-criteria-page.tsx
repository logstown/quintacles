import { MediaType } from '@prisma/client'
import { MovieTvCriteriaCard } from './movie-tv-criteria-card'
import { surpriseMe } from '@/app/actions'
import { CriteriaBreadcrumbs } from './CriteriaBreadcrumbs'
import { PopularLists } from './PopularLists'

export function MovieTvCriteriaBuild({ mediaType }: { mediaType: MediaType }) {
  const surpriseMeWithMediaType = surpriseMe.bind(null, mediaType)
  return (
    <>
      <CriteriaBreadcrumbs mediaType={mediaType} />
      <div className='flex flex-col items-center gap-8'>
        <PopularLists mediaType={mediaType} />
        <MovieTvCriteriaCard mediaType={mediaType} />
        {/* <div className='flex items-center justify-center gap-10'>
          <p className='text-lg'>or</p>
          <form
            action={surpriseMeWithMediaType}
            className='flex items-center text-foreground-400'
          >
            <input readOnly type='text' value={mediaType} hidden />
            <SurpriseMeButton />
          </form>
        </div> */}
      </div>
    </>
  )
}
