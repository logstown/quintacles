'use client'

import { ChevronDown, ListIcon, ShuffleIcon } from 'lucide-react'
import { mediaTypeArrForLists } from '../../lib/mediaTypes'
import { Button } from '@nextui-org/button'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/dropdown'
import { cloneElement, useMemo, useState } from 'react'
import Link from 'next/link'
import { getRandomList } from '@/app/actions'
import { noop } from 'lodash'

export function BrowseDropdown({ isSmall }: { isSmall?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)

  const dropdownItems = useMemo(() => {
    const items = mediaTypeArrForLists.map(type => ({
      icon: cloneElement(type.icon, { size: 18 }),
      text: type.plural,
      href: type.urlPlural,
      onPress: () => noop(),
    }))
    items.push({
      icon: <ShuffleIcon size={18} />,
      text: 'Random List',
      href: '',
      onPress: async () => {
        setIsLoading(true)
        await getRandomList()
        setIsLoading(false)
      },
    })

    return items
  }, [setIsLoading])

  const loadingSVG = (
    <svg
      className='h-5 w-5 animate-spin text-current'
      fill='none'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        className='opacity-25'
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
      />
      <path
        className='opacity-75'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        fill='currentColor'
      />
    </svg>
  )

  return (
    <Dropdown>
      <DropdownTrigger>
        {isSmall ? (
          <Button isIconOnly size='sm' variant='ghost' disableRipple>
            <ListIcon strokeWidth={1.3} size={20} />
          </Button>
        ) : (
          <Button
            disableRipple
            endContent={
              isLoading ? loadingSVG : <ChevronDown strokeWidth={1.3} size={20} />
            }
            variant='ghost'
          >
            Browse
          </Button>
        )}
      </DropdownTrigger>
      <DropdownMenu aria-label='Media Types' variant='shadow'>
        {dropdownItems.map(type =>
          type.href ? (
            <DropdownItem
              startContent={<span className='mr-1'>{type.icon}</span>}
              as={Link}
              className='capitalize text-foreground'
              key={type.text}
              href={`/browse/${type.href}`}
            >
              {type.text}
            </DropdownItem>
          ) : (
            <DropdownItem
              startContent={<span className='mr-1'>{type.icon}</span>}
              className='text-foreground'
              color='warning'
              key={type.text}
              onPress={type.onPress}
            >
              {type.text}
            </DropdownItem>
          ),
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
