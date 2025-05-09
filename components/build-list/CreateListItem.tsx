'use client'

import { useState } from 'react'
import { getTmdbImageUrl } from '../../lib/random'
import { ListItem } from '@prisma/client'
import { Card } from "@heroui/card"
import Image from 'next/image'
import { Button } from "@heroui/button"
import { AddListIdx } from './AddListIdx'
import { XIcon } from 'lucide-react'
import { Tooltip } from "@heroui/tooltip"
import { EpisodeThumbnailFooter } from '../EpisodeThumbnailFooter'

export const CreateListItem = ({
  item,
  itemOrder,
  removeFromList,
  isEpisode,
}: {
  item?: ListItem
  itemOrder: number
  removeFromList: (item: ListItem) => void
  isEpisode: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)
  let placement = 'bottom'
  if (itemOrder !== 3) {
    placement += itemOrder < 3 ? '-start' : '-end'
  }

  const imgSrc = item
    ? getTmdbImageUrl(isEpisode ? item.backdropPath : item.posterPath, 'w300')
    : isEpisode
      ? '/dummyStill.jpeg'
      : '/dummyPoster.jpeg'

  const openChange = (open: boolean) => {
    if (!!item) {
      setIsOpen(open)
    }
  }

  return (
    <div
      className={`relative flex items-center ${isEpisode ? 'gap-3 xl:flex-col xl:gap-1' : 'flex-col gap-2'}`}
    >
      <div
        className={`text-center text-foreground-400 lg:text-xl ${isEpisode ? 'text-xl xl:order-last xl:text-base' : 'order-last'} ${!item ? 'invisible' : ''} `}
      >
        {itemOrder}
      </div>
      {!!item && (
        <Button
          className={`absolute top-0 z-10 rounded-full ${isEpisode ? 'right-2 xl:right-0' : 'right-0 h-6 w-6 min-w-6 md:h-10 md:w-10 md:min-w-10'}`}
          color='danger'
          variant='solid'
          onPress={() => removeFromList(item)}
          isIconOnly
        >
          {/* <XIcon className='hidden sm:inline' strokeWidth={3} size={40} /> */}
          <XIcon />
        </Button>
      )}
      <Tooltip
        isDisabled={!item || isEpisode}
        content={`${item?.name} (${new Date(item?.date ?? '').getFullYear()})`}
        placement='bottom'
      >
        <Card
          isFooterBlurred
          isPressable
          className={`${isEpisode ? 'aspect-video' : ''} ${item ? 'cursor-move' : 'border-3 border-dashed border-primary-200'}`}
        >
          <AddListIdx idx={itemOrder - 1} disabled={!!item}>
            <Image
              unoptimized
              width={300}
              height={isEpisode ? 169 : 450}
              className={`object-cover ${isEpisode ? 'brightness-75' : ''} ${item ? '' : 'invisible'}`}
              src={imgSrc}
              alt={`${item?.name} image`}
            />
          </AddListIdx>
          {isEpisode && !!item && (
            <EpisodeThumbnailFooter>{item.name}</EpisodeThumbnailFooter>
          )}
        </Card>
      </Tooltip>
    </div>
  )
}
