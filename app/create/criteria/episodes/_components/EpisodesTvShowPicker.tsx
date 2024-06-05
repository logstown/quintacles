'use client'

import { Suggestions } from '@/components/build-list/Suggestions'
import MediaPicker from '@/components/media-picker'
import { Card, CardBody } from '@nextui-org/card'
import { ListItem, MediaType } from '@prisma/client'
import { useRouter } from 'next/navigation'

export function EpisodesTvShowPicker({ tvShowIds }: { tvShowIds: number[] }) {
  const router = useRouter()

  // TODO: add this functionality to create similary button
  const goToBuild = (item: ListItem | undefined) => {
    if (!item) return

    router.push(`/create/list/episodes/${item.tmdbId}`)
  }
  return (
    <div className='flex flex-col gap-12'>
      <div className='flex justify-center'>
        <div className='flex flex-col items-start justify-center gap-6'>
          <h1 className='text-xl sm:text-2xl'>Choose TV Show</h1>
          <Card className='w-fit p-4' shadow='lg'>
            <CardBody>
              <MediaPicker
                labelExcludesSelect={true}
                size='lg'
                color='primary'
                onSelected={goToBuild}
                mediaType={MediaType.TvShow}
              />
            </CardBody>
          </Card>
        </div>
      </div>
      <Suggestions
        showIds={tvShowIds}
        restrictions={{
          genreId: 0,
          decade: 0,
          personId: 0,
          isLiveActionOnly: false,
          episodesTvShowId: '',
          mediaType: MediaType.TvShow,
        }}
        onItemSelected={goToBuild}
      />
    </div>
  )
}
