'use client'

import { ChevronDown, Rows3Icon } from 'lucide-react'
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

export function BrowseDropdown({ isSmall }: { isSmall?: boolean }) {
  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          {isSmall ? (
            <Button isIconOnly variant='flat'>
              {<Rows3Icon strokeWidth={1.3} size={20} />}
            </Button>
          ) : (
            <Button
              disableRipple
              endContent={<ChevronDown strokeWidth={1.3} size={20} />}
              variant='light'
            >
              Browse
            </Button>
          )}
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label='ACME features'>
        {mediaTypeArrForLists.map(type => {
          const mediaTypeIconSmaller = cloneElement(type.icon, {
            size: 18,
          })
          return (
            <DropdownItem
              startContent={
                <span className='mr-1 text-foreground-500'>
                  {mediaTypeIconSmaller}
                </span>
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
