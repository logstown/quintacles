'use client'

import { RestrictionsUI } from '@/lib/models'
import { getUserListsUrl } from '@/lib/random'
import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { SquarePenIcon } from 'lucide-react'
import { UserListActions } from './UserListActions'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

export function UserListButtons({
  userListId,
  Restrictions,
  userListUserIds,
  isSmall,
}: {
  userListId: number
  userListUserIds: string[]
  Restrictions: RestrictionsUI
  isSmall?: boolean
}) {
  const { user } = useUser()
  const iconSize = isSmall ? 24 : 28
  const userListUrl = getUserListsUrl(Restrictions)
  const doesListBelongToUser = user && userListUserIds.includes(user.id)

  return (
    <div className='flex items-center sm:gap-1'>
      {doesListBelongToUser ? (
        <UserListActions isSmall={isSmall} userListId={userListId} />
      ) : (
        <Tooltip content='Create similar list'>
          <Button
            size={isSmall ? 'md' : 'lg'}
            href={userListUrl}
            as={Link}
            isIconOnly
            className='text-foreground-400'
            aria-label='add'
            variant='light'
          >
            <SquarePenIcon size={iconSize} />
          </Button>
        </Tooltip>
      )}
    </div>
  )
}
