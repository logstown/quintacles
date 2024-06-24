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
import Link from 'next/link'

export function CreateListButton({ isSmall }: { isSmall?: boolean }) {
  return (
    <Dropdown>
      <DropdownTrigger>
        {isSmall ? (
          <Button
            isIconOnly
            className='bg-gradient-to-tr from-primary-500 to-secondary-500 text-white shadow-lg'
          >
            {<PlusIcon strokeWidth={1.3} size={20} />}
          </Button>
        ) : (
          <Button
            className='bg-gradient-to-tr from-primary-500 to-secondary-500 text-white shadow-lg'
            endContent={<ChevronDown strokeWidth={1.3} size={20} />}
          >
            Create List
          </Button>
        )}
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions'>
        {mediaTypeArrForLists.map(({ icon, urlPlural, plural }) => {
          const mediaTypeIconSmaller = cloneElement(icon, {
            size: 18,
          })
          return (
            <DropdownItem
              startContent={
                <span className='mr-1 text-foreground-600'>
                  {mediaTypeIconSmaller}
                </span>
              }
              className='capitalize text-foreground'
              as={Link}
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
