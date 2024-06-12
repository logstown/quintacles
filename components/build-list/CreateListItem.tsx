'use client'

import { useState } from 'react'
import { getTmdbImageUrl } from '../../lib/random'
import { ListItem } from '@prisma/client'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { Image } from '@nextui-org/image'
import { Card, CardFooter } from '@nextui-org/card'
import NextImage from 'next/image'
import { Button } from '@nextui-org/button'

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
      className={`flex items-center ${isEpisode ? 'gap-3 sm:flex-col sm:gap-1' : 'flex-col gap-2'}`}
    >
      <div
        className={`text-center text-neutral-400 lg:text-xl ${isEpisode ? 'text-xl sm:order-last sm:text-base' : 'order-last'} `}
      >
        {itemOrder}
      </div>
      <Popover
        placement={placement as any}
        showArrow={true}
        isOpen={isOpen}
        onOpenChange={openChange}
      >
        <PopoverTrigger>
          <Card
            isPressable={!!item}
            isFooterBlurred
            className={`${isEpisode ? 'aspect-video' : ''} ${item ? '' : 'border-3 border-dashed border-secondary-200'}`}
          >
            <Image
              as={NextImage}
              width={300}
              height={isEpisode ? 169 : 450}
              className={`object-cover ${isEpisode ? 'brightness-75' : ''} ${item ? '' : 'invisible'}`}
              src={imgSrc}
              alt='NextUI hero Image'
            />
            {isEpisode && !!item && (
              <CardFooter className='absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-center overflow-hidden rounded-large border-1 border-white/20 py-1 shadow-small before:rounded-xl before:bg-white/10'>
                <p className='text-left text-tiny text-white/80'>{item?.name}</p>
              </CardFooter>
            )}
          </Card>
        </PopoverTrigger>
        {!!item && (
          <PopoverContent>
            <div className='flex flex-col gap-2 p-1'>
              <div className='font-bold'>
                {item.name}{' '}
                <span className='text-tiny font-normal'>
                  ({new Date(item.date || '').getFullYear()})
                </span>
              </div>
              <div className='text-center'>
                <Button
                  size='sm'
                  className='w-full'
                  variant='flat'
                  color='danger'
                  onPress={() => {
                    removeFromList(item)
                    setIsOpen(false)
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}
