'use client'

import { InfoIcon, SearchIcon } from 'lucide-react'
import { useEffect } from 'react'
import { findIndex, intersection, range, some } from 'lodash'
import { convertMediaItem } from '../../lib/random'
import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import { SuggestionItem } from './SuggestionItem'
import { useDebounce, useScrollAfter5Items } from '../../lib/hooks'
import { mediaTypes } from '../../lib/mediaTypes'
import { ListItem, MediaType } from '@prisma/client'
import { getSuggestions } from '@/app/actions'
import { RestrictionsUI } from '@/lib/models'
import { useInView } from 'react-intersection-observer'
import { Spinner } from '@nextui-org/spinner'
import { Input } from '@nextui-org/input'
import { useRouter } from 'next/navigation'
import { TmdbGenres } from '@/lib/TmdbModels'
import { Skeleton } from '@nextui-org/skeleton'
import { Image } from '@nextui-org/image'
import NextImage from 'next/image'

export function Suggestions({
  addListItem,
  removeFromList,
  restrictions,
  listItems,
  mediaIds,
  isForTvShowSelection,
  mediaType,
}: {
  addListItem?: (item: ListItem) => void
  removeFromList?: (item: ListItem) => void
  restrictions: RestrictionsUI
  listItems?: ListItem[]
  mediaIds?: number[]
  isForTvShowSelection?: boolean
  mediaType?: MediaType
}) {
  const router = useRouter()
  const [ref, inView] = useInView()
  const [searchText, setSearchText] = React.useState('')
  const debouncedSearchText = useDebounce(searchText, 500)
  const tvGenresToExclude = [TmdbGenres.News, TmdbGenres.Soap, TmdbGenres.Talk]

  const getSearchRestults = async () => {
    const res = await fetch(
      `/api/tmdb/search/?mediaType=${mediaTypes[restrictions.mediaType].url}&query=${debouncedSearchText}`,
    )

    const { data } = await res.json()
    return data
  }

  const fetchSuggestions = async ({ pageParam }: { pageParam: any }) => {
    const data =
      debouncedSearchText.length >= 3
        ? await getSearchRestults()
        : await getSuggestions(pageParam, restrictions)

    const suggestions = data.results
      .filter((x: any) => !mediaIds?.includes(x.id))
      .filter((x: any) =>
        isForTvShowSelection
          ? intersection(x.genre_ids, tvGenresToExclude).length === 0
          : true,
      )
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
    if (addListItem && removeFromList) {
      if (some(listItems, { tmdbId: item.tmdbId })) {
        removeFromList(item)
      } else {
        addListItem(item)
        setTimeout(() => setSearchText(''), 1000)
      }
    } else if (mediaType) {
      router.push(
        `/create/list/${mediaTypes[mediaType].urlPlural}?episodesTvShowId=${item.tmdbId}`,
      )
    }
  }

  return (
    <div className='mx-auto flex max-w-screen-lg flex-col items-center gap-8'>
      <div>
        <h2 className='text-2xl'>
          {debouncedSearchText ? 'Search' : 'Search or choose from suggestions:'}
        </h2>
        <Input
          startContent={<SearchIcon size={15} />}
          isClearable
          size='lg'
          placeholder='Search'
          variant='faded'
          value={searchText}
          className='mt-4 max-w-[400px]'
          onValueChange={setSearchText}
        />
      </div>
      {status === 'pending' ? (
        <div className='suggestions-grid sm:suggestions-larger w-full'>
          {range(20).map(i => (
            <Skeleton key={i} className='rounded-xl'>
              <Image
                unoptimized
                as={NextImage}
                width={300}
                height={450}
                className='max-h-[262.5px]'
                src='/dummyPoster.jpeg'
                alt='dummy poster'
              />
            </Skeleton>
          ))}
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
