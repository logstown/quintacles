'use client'

import { Button } from "@heroui/button"
import { Tooltip } from "@heroui/tooltip"
import { CheckIcon, ShareIcon } from 'lucide-react'
import { useState } from 'react'
import copy from 'clipboard-copy'

export function ShareListButton({
  isSmall,
  iconSize,
  userListId,
}: {
  isSmall?: boolean
  iconSize: number
  userListId: number
}) {
  const [listShared, setListShared] = useState(false)

  const copyToClipboard = () => {
    copy(`${window.location.origin}/list/${userListId}`)
    setListShared(true)

    setTimeout(() => setListShared(false), 5000)
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
