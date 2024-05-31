'use client'

import { some } from 'lodash'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { mediaTypes } from '../../lib/mediaTypes'
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover'
import { Button } from '@nextui-org/button'
import { ListItem, MediaType } from '@prisma/client'
import MediaPicker from '../media-picker'

export function AddMedia({
  addListItem,
  mediaType,
  listItems,
}: {
  addListItem: (item: ListItem) => void
  mediaType: MediaType
  listItems: ListItem[]
}) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)

  const mediaPicked = (item: ListItem | undefined) => {
    setIsMediaPickerOpen(false)

    if (!item) return

    if (some(listItems, { id: item.id })) return
    addListItem(item)
  }

  return (
    <div
      className='absolute flex flex-col items-center'
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%)',
      }}
    >
      <em className='hidden text-foreground-500 sm:block'>
        Add {mediaTypes[mediaType].display}
      </em>
      <Popover
        isOpen={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        showArrow={true}
        classNames={{
          base: 'min-w-96',
        }}
      >
        <PopoverTrigger>
          <Button
            isIconOnly
            className={`my-4 text-foreground-500 sm:mx-4`}
            size='lg'
            variant='ghost'
          >
            <PlusIcon size={24} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='py-4'>
          <MediaPicker
            shouldAutoFocus={true}
            idsToExclude={listItems.map(x => x.id)}
            onSelected={mediaPicked}
            mediaType={mediaType}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
