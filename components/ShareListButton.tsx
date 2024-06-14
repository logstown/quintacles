'use client'

import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { CheckIcon, ShareIcon } from 'lucide-react'
import { useState } from 'react'

export function ShareListButton({
  isSmall,
  iconSize,
  userListId,
}: {
  isSmall?: boolean
  iconSize: number
  userListId: string
}) {
  const [listShared, setListShared] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`http://localhost:5173/list/${userListId}`) // TODO fix this
    setListShared(true)

    setTimeout(() => {
      setListShared(false)
    }, 5000)
  }
  return (
    <Tooltip content='Link copied to clipboard!' isOpen={listShared}>
      <Button
        isIconOnly
        isDisabled={listShared}
        className='text-foreground-400'
        aria-label='share'
        size={isSmall ? 'sm' : 'md'}
        onPress={copyToClipboard}
        variant='light'
      >
        {listShared ? (
          <CheckIcon size={iconSize} color='green' />
        ) : (
          <ShareIcon size={iconSize} />
        )}
      </Button>
    </Tooltip>
  )
}
