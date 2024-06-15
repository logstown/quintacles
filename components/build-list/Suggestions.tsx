'use client'

import { InfoIcon, SearchIcon } from 'lucide-react'
import { useEffect } from 'react'
import { findIndex } from 'lodash'
import { convertMediaItem } from '../../lib/random'
import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import { SuggestionItem } from './SuggestionItem'
import { useDebounce, useScrollAfter5Items } from '../../lib/hooks'
import { mediaTypes } from '../../lib/mediaTypes'
import { ListItem } from '@prisma/client'
import { getSuggestions } from '@/app/actions'
import { RestrictionsUI } from '@/lib/models'
import { useInView } from 'react-intersection-observer'
import { Spinner } from '@nextui-org/spinner'
import { Input } from '@nextui-org/input'
import { useRouter } from 'next/navigation'

export function Suggestions({
  onItemSelected,
  restrictions,
  listItems,
  mediaIds,
}: {
  onItemSelected?: (item: ListItem) => void
  restrictions: RestrictionsUI
  listItems?: ListItem[]
  mediaIds?: number[]
}) {
  const router = useRouter()
  const [ref, inView] = useInView()
  const [searchText, setSearchText] = React.useState('')
  const debouncedSearchText = useDebounce(searchText, 500)

  const getSearchRestults = async () => {
    const res = await fetch(
      `/api/tmdb/search/?mediaType=${mediaTypes[restrictions.mediaType].url}&query=${debouncedSearchText}`,
    )

    const { data } = await res.json()
    return data
  }

  const fetchSuggestions = async ({ pageParam }: { pageParam: any }) => {
    const data = debouncedSearchText
      ? await getSearchRestults()
      : await getSuggestions(pageParam, restrictions)

    const suggestions = data.results
      .filter((x: any) => !mediaIds?.includes(x.id))
      .map((x: any) => convertMediaItem(x, restrictions.mediaType))
    return {
      suggestions,
      page: data.page,
      totalPages: debouncedSearchText ? 1 : data.total_pages,
    }
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
    queryKey: ['suggestions', restrictions, debouncedSearchText],
    queryFn: fetchSuggestions,
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      return lastPage.page == lastPage.totalPages ? null : lastPage.page + 1
    },
  })

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage])

  useScrollAfter5Items(listItems?.length)

  const suggestionSelected = (item: ListItem) => {
    if (onItemSelected) {
      onItemSelected(item)
    } else {
      router.push(`/create/list/episodes/${item.tmdbId}`)
    }
  }

  return (
    <div className='flex w-full flex-col items-center gap-8'>
      <div>
        <h2 className='text-2xl'>
          {debouncedSearchText ? 'Search' : 'Search or choose from suggestions:'}
        </h2>
        <Input
          startContent={<SearchIcon size={15} />}
          isClearable
          size='lg'
          placeholder='Search'
          variant='bordered'
          value={searchText}
          className='mt-4 w-[400px]'
          onValueChange={setSearchText}
        />
      </div>
      {status === 'pending' ? (
        <div className='flex justify-center'>
          <Spinner size='lg' />
        </div>
      ) : status === 'error' ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <div className='suggestions-grid sm:suggestions-larger w-full'>
            {data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.suggestions.map((item: ListItem) => {
                  const idx = findIndex(listItems, { tmdbId: item.tmdbId })
                  return (
                    <SuggestionItem
                      key={item.tmdbId}
                      item={item}
                      idx={idx}
                      onItemSelected={suggestionSelected}
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
        </>
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
