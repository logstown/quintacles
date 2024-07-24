'use client'

import { RestrictionsUI } from '@/lib/models'
import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { ListPlusIcon } from 'lucide-react'
import { UserListActions } from './UserListActions'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useUserListUrl } from '@/lib/hooks'

export function UserListButtons({
  userListId,
  Restrictions,
  usernames,
  isSmall,
}: {
  userListId: number
  usernames: string[]
  Restrictions: RestrictionsUI
  isSmall?: boolean
}) {
  const { user } = useUser()
  const iconSize = isSmall ? 20 : 28
  const userListUrl = useUserListUrl(Restrictions)
  const doesListBelongToUser = user && usernames.includes(user.username ?? '')

  return (
    <div className='flex items-center sm:gap-1'>
      {doesListBelongToUser ? (
        <UserListActions
          isSmall={isSmall}
          usernames={usernames}
          restrictions={Restrictions}
          userListId={userListId}
        />
      ) : (
        <Tooltip content='Create this list!'>
          <Button
            size={isSmall ? 'sm' : 'lg'}
            href={userListUrl}
            as={Link}
            prefetch={!!user}
            isIconOnly
            className='text-foreground-400'
            aria-label='add'
            variant='light'
          >
            <ListPlusIcon size={iconSize} />
          </Button>
        </Tooltip>
      )}
    </div>
  )
}
