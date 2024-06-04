'use client'

import { PlusIcon } from 'lucide-react'
import { mediaTypeArrForLists } from '../../lib/mediaTypes'
import { cloneElement } from 'react'
import { Button } from '@nextui-org/button'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown'
import { Link } from '@nextui-org/link'

export function CreateListButton() {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className='bg-gradient-to-tr from-primary-500 to-secondary-500 text-white shadow-lg'
          startContent={<PlusIcon size={20} />}
        >
          Create List
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions'>
        {mediaTypeArrForLists.map(({ icon, urlPlural, plural }) => {
          const mediaTypeIconSmaller = cloneElement(icon, {
            size: 18,
            strokeWidth: 1.5,
          })
          return (
            <DropdownItem
              startContent={
                <span className='text-foreground-600'>
                  {mediaTypeIconSmaller}
                </span>
              }
              className='capitalize text-foreground'
              key={urlPlural}
              as={Link}
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
