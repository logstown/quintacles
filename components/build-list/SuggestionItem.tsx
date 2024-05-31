import { AddListIdx } from './AddListIdx'
import { getTmdbImageUrl } from '../../lib/random'
import { ListItem } from '@prisma/client'
import { Card } from '@nextui-org/card'
import { Tooltip } from '@nextui-org/tooltip'
import { Image } from '@nextui-org/image'
export function SuggestionItem({
  item,
  idx,
  isUnselectable,
  onItemSelected,
  mediaTypeIcon,
}: {
  item: ListItem
  idx: number
  isUnselectable?: boolean
  onItemSelected: (item: ListItem) => void
  mediaTypeIcon: React.ReactElement
}) {
  const isChosen = idx >= 0

  return (
    <AddListIdx idx={idx}>
      <Tooltip
        content={`${item.name} (${new Date(item.date).getFullYear()})`}
        placement='bottom'
        isDisabled={!item.posterPath}
        delay={1000}
      >
        <Card
          isPressable
          isDisabled={isChosen}
          onPress={() => !isChosen && !isUnselectable && onItemSelected(item)}
          className={`h-[150px] w-[100px] sm:h-[210px] sm:w-[140px] ${!isChosen && !isUnselectable ? 'hover:z-10 hover:scale-110 hover:shadow-lg' : ''} ${isUnselectable ? 'cursor-auto' : ''}`}
        >
          {item.posterPath ? (
            <Image
              src={getTmdbImageUrl(item.posterPath, 'w300')}
              alt='NextUI hero Image'
            />
          ) : (
            <div className='flex h-full w-full flex-col items-center justify-center rounded-md bg-slate-300 p-4'>
              <div className='mb-4'>{mediaTypeIcon}</div>
              <p className='text-center font-semibold'>{item.name} </p>
              <p>{item.date && `(${new Date(item.date).getFullYear()})`}</p>
            </div>
          )}
        </Card>
      </Tooltip>
    </AddListIdx>
  )
}