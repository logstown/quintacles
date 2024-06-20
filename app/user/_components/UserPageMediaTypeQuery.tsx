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
  userId?: string
  username?: string
}) {
  const lists = await userListQuery({
    userId,
    restrictions: { mediaType },
    sortBy: 'lastUserAddedAt',
    pageSize: 3,
    pageNum: 0,
  })
  const mediaTypeObj = mediaTypes[mediaType]
  const moreHref = username
    ? `/user/${username}/${mediaTypeObj.urlPlural}`
    : `/browse/${mediaTypeObj.urlPlural}`

  return (
    <>
      <UserListsWrapper isEpisodes={mediaType === MediaType.TvEpisode}>
        {lists.map((list, i) => (
          <div key={list.id} className='flex flex-col items-end'>
            <UserListCard
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
            {i === lists.length - 1 && (
              <Button
                color='secondary'
                size='lg'
                radius='lg'
                variant='light'
                as={Link}
                className='m-6'
                href={moreHref}
                endContent={<ArrowRightIcon size={15} />}
              >
                All {mediaTypeObj.display} lists
              </Button>
            )}
          </div>
        ))}
      </UserListsWrapper>
      {/* <div className='flex justify-end pr-4'></div> */}
    </>
  )
}
