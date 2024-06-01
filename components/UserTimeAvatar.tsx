import { Avatar } from '@nextui-org/avatar'
import { Tooltip } from '@nextui-org/tooltip'
import { User } from '@prisma/client'
import Link from 'next/link'

export function UserTimeAvatar({
  user,
  size,
}: {
  user?: Pick<User, 'username' | 'displayName' | 'photoURL'>
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <Tooltip content={user?.displayName ?? `@${user?.username}`}>
      <Avatar
        isFocusable
        as={Link}
        href={`/user/${user?.username}`}
        className='transition-transform'
        size={size}
        showFallback={true}
        src={user?.photoURL ?? undefined}
      />
    </Tooltip>
  )
}
