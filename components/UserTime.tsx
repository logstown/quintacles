import { formatDistanceToNowStrict } from 'date-fns'
import { random } from 'lodash'
import { User } from '@prisma/client'
import { AvatarGroup } from '@nextui-org/avatar'
import { UserTimeAvatar } from './UserTimeAvatar'

export function UserTime({
  users,
  lastUserAddedAt,
  size,
  excludeUser,
}: {
  users: Pick<User, 'username' | 'displayName' | 'photoURL'>[]
  lastUserAddedAt: Date
  size?: 'sm' | 'md' | 'lg'
  excludeUser?: boolean
}) {
  const usersToDisplay =
    users.length <= 5
      ? users
      : [1, 2, 3, 4, 5].map(i => users[random(0, users.length - 1)])

  return (
    <div
      className={`flex items-center gap-3 ${usersToDisplay.length > 1 ? 'ml-2' : ''}`}
    >
      {!excludeUser && !!usersToDisplay.length && (
        <>
          {usersToDisplay.length === 1 ? (
            <UserTimeAvatar user={usersToDisplay[0]} size={size} />
          ) : (
            <AvatarGroup total={users.length - 5}>
              {usersToDisplay.map((user, i) => (
                <UserTimeAvatar key={i} user={user} size={size} />
              ))}
            </AvatarGroup>
          )}
        </>
      )}
      {users.length > 5 && <p>·</p>}
      <p
        className={`text-tiny text-foreground-400 ${size === 'sm' ? '' : 'sm:text-base'}`}
      >
        {formatDistanceToNowStrict(lastUserAddedAt)}
      </p>
    </div>
  )
}
