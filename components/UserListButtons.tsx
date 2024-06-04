import { RestrictionsUI } from '@/lib/models'
import { getUserListsUrl } from '@/lib/random'
import { Button } from '@nextui-org/button'
import { Tooltip } from '@nextui-org/tooltip'
import { UserList } from '@prisma/client'
import { CheckIcon, ListPlus, ShareIcon } from 'lucide-react'
import { useState } from 'react'
import { ShareListButton } from './ShareListButton'
import { currentUser } from '@clerk/nextjs/server'
import { UserListActions } from './UserListActions'
import Link from 'next/link'

export async function UserListButtons({
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
  const iconSize = isSmall ? 20 : 24
  const userListUrl = getUserListsUrl(Restrictions)

  const user = await currentUser()
  const doesListBelongToUser = user && userListUserIds.includes(user.id)

  return (
    <div className='flex items-center sm:gap-1'>
      <ShareListButton
        isSmall={isSmall}
        iconSize={iconSize}
        userListId={userListId}
      />
      {doesListBelongToUser ? (
        <UserListActions
          isSmall={isSmall}
          userListId={userListId}
          userId={user.id}
        />
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
      {/* <UserListLikes userListId={userList.id} numLikes={userList.numLikes} /> */}
    </div>
  )
}
