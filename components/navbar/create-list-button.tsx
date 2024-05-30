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
          variant='flat'
          color='primary'
          startContent={<PlusIcon size={20} />}
        >
          Create List
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions'>
        {mediaTypeArrForLists.map(type => {
          const mediaTypeIconSmaller = cloneElement(type.icon, {
            size: 18,
            strokeWidth: 1.5,
          })
          return (
            <DropdownItem
              startContent={
                <span className='text-foreground-500'>
                  {mediaTypeIconSmaller}
                </span>
              }
              className='capitalize text-black'
              key={type.url}
              as={Link}
              href={`/create/${type.url}/criteria`}
            >
              {type.plural}
            </DropdownItem>
          )
        })}
      </DropdownMenu>
    </Dropdown>
  )
}
