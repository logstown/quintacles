'use client'

import { ChevronDown } from 'lucide-react'
import { mediaTypeArrForLists } from '../../lib/mediaTypes'
import { Button } from '@nextui-org/button'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown'
import { NavbarItem } from '@nextui-org/navbar'
import { cloneElement } from 'react'
import Link from 'next/link'

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
        {mediaTypeArrForLists.map(type => {
          const mediaTypeIconSmaller = cloneElement(type.icon, {
            size: 18,
            strokeWidth: 1.5,
          })
          return (
            <DropdownItem
              startContent={
                <span className='text-foreground-500'>{mediaTypeIconSmaller}</span>
              }
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
