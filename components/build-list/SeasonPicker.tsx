import { ListItem } from '@prisma/client'
import { findIndex } from 'lodash'
import { Card, CardBody } from '@nextui-org/card'
import { format } from 'date-fns'
import { Image } from '@nextui-org/image'
import { AddListIdx } from './AddListIdx'
import NextImage from 'next/image'
import { getTmdbImageUrl } from '@/lib/random'

export function SeasonPicker({
  onItemSelected,
  listItems,
  seasons,
}: {
  onItemSelected: (item: ListItem) => void
  listItems?: ListItem[]
  seasons: ListItem[]
}) {
  const isUnselectable = listItems?.length === 5

  return (
    <>
      <h3 className='p-3 text-2xl'>Choose from below:</h3>
      <div className='flex flex-col gap-10'>
        {seasons.map(season => {
          const idx = findIndex(listItems, { tmdbId: season.tmdbId }) // TODO could improve performance with useEffect or useMemo
          const isChosen = idx >= 0

          return (
            <Card
              isDisabled={isChosen}
              key={season.tmdbId}
              className={`p-10 ${isUnselectable ? 'cursor-auto' : ''}`}
              isPressable={!isChosen && !isUnselectable}
              onPress={() => onItemSelected(season)}
            >
              <CardBody>
                <div className='flex flex-col items-center gap-8 sm:flex-row sm:gap-12'>
                  <div className='flex items-baseline justify-start gap-4 sm:hidden'>
                    <div className='text-2xl font-semibold'>{season.name}</div>
                    <div className='text-foreground-500'>
                      {format(new Date(season.date), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <div className='min-w-[185px]'>
                    <AddListIdx idx={idx}>
                      <Image
                        unoptimized
                        as={NextImage}
                        width={185}
                        height={278}
                        alt={season.name}
                        src={getTmdbImageUrl(season.posterPath, 'w185')}
                      />
                    </AddListIdx>
                  </div>
                  <div className='flex flex-col gap-8'>
                    <div className='hidden items-baseline justify-start gap-4 sm:flex'>
                      <div className='text-2xl font-semibold'>{season.name}</div>
                      <div className='text-foreground-500'>
                        {format(new Date(season.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div>{season.overview}</div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </>
  )
}
