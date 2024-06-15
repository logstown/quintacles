'use client'

import { RestrictionsUI } from '@/lib/models'
import { getUserListsUrl } from '@/lib/random'
import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { ListPlus } from 'lucide-react'
import { ShareListButton } from './ShareListButton'
import { UserListActions } from './UserListActions'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

export function UserListButtons({
  userListId,
  Restrictions,
  userListUserIds,
  isSmall,
}: {
  userListId: string
  userListUserIds: string[]
  Restrictions: RestrictionsUI
  isSmall?: boolean
}) {
  const { user } = useUser()
  const iconSize = isSmall ? 20 : 24
  const userListUrl = getUserListsUrl(Restrictions)
  const doesListBelongToUser = user && userListUserIds.includes(user.id)

  return (
    <div className='flex items-center sm:gap-1'>
      <ShareListButton
        isSmall={isSmall}
        iconSize={iconSize}
        userListId={userListId}
      />
      {doesListBelongToUser ? (
        <UserListActions isSmall={isSmall} userListId={userListId} />
      ) : (
        <Tooltip content='Create similar list'>
          <Button
            size={isSmall ? 'sm' : 'md'}
            href={userListUrl}
            as={Link}
            isIconOnly
            className='text-foreground-400'
            aria-label='add'
            variant='light'
          >
            <ListPlus size={iconSize} />
          </Button>
        </Tooltip>
      )}
    </div>
  )
}
