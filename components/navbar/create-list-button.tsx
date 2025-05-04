'use client'

import { ChevronDown, PlusIcon } from 'lucide-react'
import { mediaTypeArrForLists } from '../../lib/mediaTypes'
import { cloneElement } from 'react'
import { Button } from '@nextui-org/button'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown'

export function CreateListButton({ isSmall }: { isSmall?: boolean }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        {isSmall ? (
          <Button
            isIconOnly
            size='sm'
            className='bg-gradient-to-tr from-primary-600 via-primary-500 to-secondary-400 text-white shadow-lg'
          >
            {<PlusIcon strokeWidth={1.3} size={20} />}
          </Button>
        ) : (
          <Button
            className='bg-gradient-to-tr from-primary-600 via-primary-500 to-secondary-400 text-white shadow-lg'
            endContent={<ChevronDown strokeWidth={1.3} size={20} />}
          >
            Create List
          </Button>
        )}
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions' variant='shadow' color='primary'>
        {mediaTypeArrForLists.map(({ icon, urlPlural, plural }) => {
          const mediaTypeIconSmaller = cloneElement(icon, {
            size: 18,
          })
          return (
            <DropdownItem
              textValue={plural}
              startContent={<span className='mr-1'>{mediaTypeIconSmaller}</span>}
              className='capitalize text-foreground'
              key={urlPlural}
              href={`/create/criteria/${urlPlural}`}
            >
              {plural}
            </DropdownItem>
          )
        })}
      </DropdownMenu>
    </Dropdown>
  )
}
