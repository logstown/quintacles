import { UserListCard } from '@/components/user-list/UserList'
import { UserListsWrapper } from '@/components/user-list/UserListsWrapper'
import { userListQuery } from '@/lib/PrismaService'
import { mediaTypes } from '@/lib/mediaTypes'
import { Button } from '@nextui-org/button'
import { MediaType } from '@prisma/client'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export async function UserPageMediaTypeQuery({
  mediaType,
  userId,
  username,
}: {
  mediaType: MediaType
  userId: string
  username: string
}) {
  const lists = await userListQuery({
    userId,
    restrictions: { mediaType },
    sortBy: 'lastUserAddedAt',
    pageSize: 3,
    pageNum: 1,
  })
  return (
    <UserListsWrapper isEpisodes={mediaType === MediaType.TvEpisode}>
      {lists.map(list => (
        <UserListCard
          key={list.id}
          restrictions={list.Restrictions}
          id={list.id}
          users={list.users}
          listItemLites={[
            list.item1,
            list.item2,
            list.item3,
            list.item4,
            list.item5,
          ]}
          excludeUser={!!userId}
          lastUserAddedAt={list.lastUserAddedAt}
        />
      ))}
      <div className='flex justify-end pr-4'>
        <Button
          color='primary'
          radius='full'
          as={Link}
          href={`/user/${username}/${mediaTypes[mediaType].urlPlural}`}
          endContent={<ArrowRightIcon size={20} />}
        >
          All {mediaTypes[mediaType].display} Lists
        </Button>
      </div>
    </UserListsWrapper>
  )
}
