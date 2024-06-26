'use client'

import { UserListCard } from '../../../components/user-list/UserList'
import { RestrictionsUI } from '@/lib/models'
import { MediaType } from '@prisma/client'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Spinner } from '@nextui-org/spinner'
import React from 'react'
import { userListQueryServer } from '@/app/actions'
import { UserListsWrapper } from '@/components/user-list/UserListsWrapper'

export function UserListInfinite({
  // initialData,
  restrictions,
  userId,
  sortBy,
  exactMatch = false,
}: {
  // initialData: any
  restrictions: RestrictionsUI
  sortBy: 'lastUserAddedAt' | 'users'
  userId?: string
  exactMatch: boolean
}) {
  const [ref, inView] = useInView()

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    // initialData,
    queryKey: ['userLists', restrictions, sortBy, exactMatch, userId],
    queryFn: async ({ pageParam }) => {
      console.log(pageParam)
      const lists = await userListQueryServer({
        userId,
        restrictions,
        sortBy,
        exactMatch,
        pageSize: 5,
        pageNum: pageParam,
      })
      return {
        lists,
        page: pageParam,
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allpages, lastPageParam) => {
      if (lastPage.lists.length === 0) {
        return undefined
      }
      return lastPageParam + 1
    },
  })

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage])

  return (
    <>
      {status === 'error' ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <UserListsWrapper
            isBrowse={true}
            isEpisodes={restrictions.mediaType === MediaType.TvEpisode}
          >
            {data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.lists.map(list => (
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
                    excludeTitle={exactMatch}
                    lastUserAddedAt={list.lastUserAddedAt}
                  />
                ))}
              </React.Fragment>
            ))}
          </UserListsWrapper>
          {isPending && (
            <div className='mt-14 flex justify-center'>
              <Spinner size='lg' className='ml-10' />
            </div>
          )}
          {!isPending && (hasNextPage || (isFetching && !isFetchingNextPage)) && (
            <div className='mt-14 flex justify-center'>
              <Spinner ref={ref} size='lg' className='ml-10' />
            </div>
          )}
        </>
      )}
      {data?.pages[0]?.lists.length === 0 && (
        <em className='p-10 text-xl text-foreground-500'>Nothing yet</em>
      )}
    </>
  )
}
