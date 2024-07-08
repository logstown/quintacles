'use client'

import { ChevronDown, ListIcon } from 'lucide-react'
import { mediaTypeArrForLists } from '../../lib/mediaTypes'
import { Button } from '@nextui-org/button'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown'
import { cloneElement } from 'react'
import Link from 'next/link'

export function BrowseDropdown({ isSmall }: { isSmall?: boolean }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        {isSmall ? (
          <Button isIconOnly size='sm' variant='flat' color='primary' disableRipple>
            <ListIcon strokeWidth={1.3} size={20} />
          </Button>
        ) : (
          <Button
            disableRipple
            endContent={<ChevronDown strokeWidth={1.3} size={20} />}
            variant='flat'
            color='primary'
          >
            Browse
          </Button>
        )}
      </DropdownTrigger>
      <DropdownMenu aria-label='ACME features' variant='shadow' color='primary'>
        {mediaTypeArrForLists.map(type => {
          const mediaTypeIconSmaller = cloneElement(type.icon, {
            size: 18,
          })
          return (
            <DropdownItem
              startContent={<span className='mr-1'>{mediaTypeIconSmaller}</span>}
              as={Link}
              className='capitalize text-foreground'
              key={type.urlPlural}
              href={`/browse/${type.urlPlural}`}
            >
              {type.plural}
            </DropdownItem>
          )
        })}
      </DropdownMenu>
    </Dropdown>
  )
}
