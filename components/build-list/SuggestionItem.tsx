import { AddListIdx } from './AddListIdx'
import { getTmdbImageUrl } from '../../lib/random'
import { ListItem } from '@prisma/client'
import { Card } from '@nextui-org/card'
import { Tooltip } from '@nextui-org/tooltip'
import NextImage from 'next/image'
import { Image } from '@nextui-org/image'

export function SuggestionItem({
  item,
  idx,
  onItemSelected,
  mediaTypeIcon,
}: {
  item: ListItem
  idx: number
  onItemSelected: (item: ListItem) => void
  mediaTypeIcon: React.ReactElement
}) {
  const isChosen = idx >= 0

  return (
    <Tooltip
      content={`${item.name} (${new Date(item.date).getFullYear()})`}
      placement='bottom'
      isDisabled={!item.posterPath}
      delay={1000}
    >
      <Card
        isPressable
        isDisabled={isChosen}
        onPress={() => onItemSelected(item)}
        className={`h-full w-full justify-center shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] ${idx < 0 ? 'hover:z-10 hover:scale-110 hover:shadow-lg' : ''} ${isChosen ? 'cursor-pointer' : ''}`}
      >
        <AddListIdx idx={idx}>
          {item.posterPath ? (
            <Image
              unoptimized
              as={NextImage}
              width={300}
              height={450}
              className='max-h-[262.5px]'
              src={getTmdbImageUrl(item.posterPath, 'w300')}
              alt={`${item.name} poster`}
            />
          ) : (
            <div className='flex h-full w-full flex-col items-center justify-center rounded-md bg-slate-300 p-4'>
              <div className='mb-4'>{mediaTypeIcon}</div>
              <p className='text-center font-semibold'>{item.name} </p>
              <p>{item.date && `(${new Date(item.date).getFullYear()})`}</p>
            </div>
          )}
        </AddListIdx>
      </Card>
    </Tooltip>
  )
}
