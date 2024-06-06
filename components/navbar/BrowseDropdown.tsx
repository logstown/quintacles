'use client'

import { ChevronDown, Link } from 'lucide-react'
import { mediaTypeArrForLists } from '../../lib/mediaTypes'
import { Button } from '@nextui-org/button'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown'
import { NavbarItem } from '@nextui-org/navbar'

export function BrowseDropdown() {
  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Button
            disableRipple
            className='bg-transparent p-0 data-[hover=true]:bg-transparent'
            radius='sm'
            endContent={<ChevronDown strokeWidth={1.3} size={20} />}
            variant='light'
          >
            Browse
          </Button>
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label='ACME features'>
        {mediaTypeArrForLists.map(type => (
          <DropdownItem
            startContent={<span className='text-neutral-400'>{type.icon}</span>}
            className='capitalize text-black'
            key={type.urlPlural}
            href={`/explore/${type.urlPlural}`}
          >
            {type.plural}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
