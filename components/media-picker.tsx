import React, { useEffect, useState } from 'react'
import { find, map } from 'lodash'
import { mediaTypes } from '../lib/mediaTypes'
import { TmdbItem } from '../lib/TmdbModels'
import { ListItem, MediaType } from '@prisma/client'
import { useDebounce } from '@/lib/hooks'
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete'
import { convertMediaItem, getTmdbImageUrl } from '@/lib/random'
import { Avatar } from '@nextui-org/avatar'
import { useQuery } from '@tanstack/react-query'

export default function MediaPicker({
  mediaType,
  selectedItem,
  shouldAutoFocus,
  labelExcludesSelect,
  color,
  size,
  idsToExclude,
  onSelected,
}: {
  mediaType: MediaType
  selectedItem?: Partial<{ name: string }>
  shouldAutoFocus?: boolean
  labelExcludesSelect?: boolean
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | undefined
  size?: 'sm' | 'md' | 'lg'
  idsToExclude?: number[]
  onSelected?: (item: ListItem | undefined) => void
}) {
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText, 500)

  const { data: items, isLoading } = useQuery({
    queryKey: ['search', mediaType, debouncedSearchText],
    queryFn: async () => {
      const res = await fetch(
        `/api/tmdb/search/?mediaType=${mediaTypes[mediaType].url}&query=${debouncedSearchText}`,
      )

      const {
        data: { results },
      } = await res.json()

      const items = map(results, (x: TmdbItem) =>
        convertMediaItem(x, mediaType),
      ).filter(x => !idsToExclude?.includes(x.tmdbId))

      return items
    },
    enabled: debouncedSearchText.length >= 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity, // TODO this probably isn't great
  })

  const onSelectionChange = (key: React.Key | null) => {
    if (onSelected) {
      const item = find(items, { tmdbId: Number(key) })
      onSelected(item)
    }
  }

  const inputChange = (inputString: string) => {
    setSearchText(inputString)
    if (inputString.length === 0 && onSelected) {
      onSelected(undefined)
    }
  }

  useEffect(() => setSearchText(selectedItem?.name ?? ''), [selectedItem])

  return (
    <>
      <Autocomplete
        size={size ?? 'md'}
        className='w-auto'
        classNames={{ popoverContent: 'sm:w-96' }}
        inputValue={searchText}
        labelPlacement='outside'
        variant='bordered'
        isLoading={isLoading}
        items={items ?? []}
        label={
          labelExcludesSelect
            ? mediaTypes[mediaType].display
            : `Select a ${mediaTypes[mediaType].display}`
        }
        placeholder='Type to search...'
        color={color}
        menuTrigger='input'
        onInputChange={inputChange}
        onSelectionChange={onSelectionChange}
      >
        {item => (
          <AutocompleteItem
            key={item.tmdbId}
            className='capitalize'
            startContent={
              <Avatar
                size='lg'
                className='mr-2'
                classNames={{
                  img: mediaType === MediaType.Person ? 'object-[0_-5px]' : '',
                }}
                radius='sm'
                showFallback
                fallback={mediaTypes[mediaType].icon}
                src={getTmdbImageUrl(item.posterPath, 'w92')}
              />
            }
            endContent={new Date(item.date).getFullYear() || ''}
          >
            {item.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </>
  )
}
