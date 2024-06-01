'use client'

import { Suggestions } from '@/components/build-list/Suggestions'
import MediaPicker from '@/components/media-picker'
import { getUserListsUrl } from '@/lib/random'
import { Card, CardBody } from '@nextui-org/card'
import { ListItem, MediaType, UserList } from '@prisma/client'
import { useRouter } from 'next/navigation'

export function EpisodesTvShowPicker({ tvShowIds }: { tvShowIds: number[] }) {
  const router = useRouter()

  const goToBuild = (item: ListItem | undefined) => {
    if (!item) return
    const id = item.id.split('-')[1]

    router.push(`/create/list/episodes/${id}`)
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
