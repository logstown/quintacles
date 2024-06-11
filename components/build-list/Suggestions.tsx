'use client'

import { InfoIcon } from 'lucide-react'
import { useEffect } from 'react'
import { findIndex } from 'lodash'
import { convertMediaItem } from '../../lib/random'
import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import { SuggestionItem } from './SuggestionItem'
import { useScrollAfter5Items } from '../../lib/hooks'
import { mediaTypes } from '../../lib/mediaTypes'
import { ListItem } from '@prisma/client'
import { getSuggestions } from '@/app/actions'
import { RestrictionsUI } from '@/lib/models'
import { useInView } from 'react-intersection-observer'
import { Spinner } from '@nextui-org/spinner'

export function Suggestions({
  onItemSelected,
  restrictions,
  listItems,
  showIds,
}: {
  onItemSelected: (item: ListItem) => void
  restrictions: RestrictionsUI
  listItems?: ListItem[]
  showIds?: number[]
}) {
  const [ref, inView] = useInView()

  const fetchSuggestions = async ({ pageParam }: { pageParam: any }) => {
    const data = await getSuggestions(pageParam, restrictions)

    const suggestions = data.results
      .filter((x: any) => !showIds?.includes(x.id))
      .map((x: any) => convertMediaItem(x, restrictions.mediaType))
    return { suggestions, page: data.page, totalPages: data.total_pages }
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['suggestions', restrictions],
    queryFn: fetchSuggestions,
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.page == lastPage.totalPages ? null : lastPage.page + 1
    },
  })

  useEffect(() => {
    console.log('inView', inView)
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  useScrollAfter5Items(listItems?.length)

  return (
    <div>
      <h2 className='p-6 text-2xl'>Suggestions</h2>
      {status === 'pending' ? (
        <div className='flex justify-center'>
          <Spinner size='lg' />
        </div>
      ) : status === 'error' ? (
        <p>Error: {error.message}</p>
      ) : (
        <div>
          <div className='suggestions-grid sm:suggestions-larger'>
            {data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.suggestions.map((item: ListItem) => {
                  const idx = findIndex(listItems, { tmdbId: item.tmdbId })
                  return (
                    <SuggestionItem
                      key={item.tmdbId}
                      item={item}
                      idx={idx}
                      onItemSelected={onItemSelected}
                      mediaTypeIcon={mediaTypes[restrictions.mediaType].icon}
                      isUnselectable={listItems?.length === 5}
                    />
                  )
                })}
              </React.Fragment>
            ))}
          </div>
          {hasNextPage && (
            <div className='mt-14 flex justify-center'>
              <Spinner ref={ref} size='lg' className='ml-10' />
            </div>
          )}
          <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
        </div>
      )}
      <div className='flex justify-center pb-6'>
        {data?.pages[0]?.suggestions.length === 0 && (
          <div className='flex flex-col items-center justify-center gap-4 text-slate-400'>
            <InfoIcon size={48} />
            <p>No items found...</p>
          </div>
        )}
      </div>
    </div>
  )
}
