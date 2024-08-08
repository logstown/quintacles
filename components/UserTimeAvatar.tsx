import { Tooltip } from '@nextui-org/tooltip'
import { User } from '@prisma/client'
import { User as UserAvatar } from '@nextui-org/user'
import Link from 'next/link'
import { formatDistanceToNowStrict } from 'date-fns'

export function UserTimeAvatar({
  user,
  size,
  userAddedDistanceToNow,
}: {
  user?: Pick<User, 'username' | 'displayName' | 'photoURL'>
  size?: 'sm' | 'md' | 'lg'
  userAddedDistanceToNow?: string
}) {
  const shouldDisplayName = userAddedDistanceToNow && size === 'lg'
  const nameToDisplay = user?.displayName ?? `@${user?.username}`
  return (
    <Tooltip
      placement='left'
      content={shouldDisplayName ? `@${user?.username}` : nameToDisplay}
    >
      <Link href={`/user/${user?.username}`}>
        <UserAvatar
          className='transition-transform'
          isFocusable
          classNames={{
            wrapper: shouldDisplayName ? 'pl-2' : '',
            name: 'text-lg',
            description: size === 'lg' ? 'text-sm' : 'text-xs',
          }}
          name={shouldDisplayName ? nameToDisplay : ''}
          description={userAddedDistanceToNow ?? ''}
          avatarProps={{
            size,
            showFallback: true,
            src: user?.photoURL ?? undefined,
          }}
        />
      </Link>
    </Tooltip>
  )
}
