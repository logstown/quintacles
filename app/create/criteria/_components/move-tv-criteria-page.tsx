import { MediaType } from '@prisma/client'
import { MovieTvCriteriaCard } from './movie-tv-criteria-card'
import { SurpriseMeButton } from './surprise-me'
import { surpriseMe } from '@/app/actions'

export function MovieTvCriteriaBuild({ mediaType }: { mediaType: MediaType }) {
  return (
    <div className='flex flex-col items-center gap-16'>
      <MovieTvCriteriaCard mediaType={mediaType} />
      <div className='flex items-center justify-center gap-10'>
        <p className='text-lg'>or</p>
        <form
          action={surpriseMe}
          className='flex items-center text-foreground-400'
        >
          <input readOnly type='text' value={mediaType} hidden />
          <SurpriseMeButton />
        </form>
      </div>
    </div>
  )
}
