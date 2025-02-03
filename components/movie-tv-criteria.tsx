'use client'

import { TmdbGenres } from '../lib/TmdbModels'
import { find, take } from 'lodash'
import { MediaType } from '@prisma/client'
import { useGenres } from '@/lib/hooks'
import { RestrictionsUI } from '@/lib/models'
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete'
import { Select, SelectItem } from '@nextui-org/select'
import MediaPicker from './media-picker'
import { getYears } from '@/lib/random'
import { useMemo, useState } from 'react'
import { networks } from '@/lib/networks'

export function MovieTvCriteria({
  restrictions: {
    year,
    genreId,
    Person,
    personId,
    isLiveActionOnly,
    mediaType,
    networkId,
    Network,
  },
  onRestrictionsChange,
  isBrowse,
}: {
  restrictions: RestrictionsUI
  onRestrictionsChange: (restrictions: RestrictionsUI) => void
  isBrowse?: boolean
}) {
  const years = useMemo(() => getYears(), [])
  const mediaTypeGenres = useGenres(mediaType)
  const [networkSearch, setNetworkSearch] = useState(Network?.name ?? '')

  const filteredNetworks = useMemo(() => {
    if (networkSearch.length < 2) {
      return []
    } else {
      const filtered = networks.filter(x =>
        x.name.toLowerCase().includes(networkSearch.toLowerCase()),
      )

      return take(filtered, 5)
    }
  }, [networkSearch])

  const setYearFromPicker = (yearId: React.Key | null) => {
    const foundyear = find(years, { id: Number(yearId) })

    onRestrictionsChange({
      mediaType,
      genreId,
      year: foundyear?.id,
      isLiveActionOnly,
      personId,
      Person,
      networkId,
      Network,
    })
  }

  const setNetworkFromPicker = (networkId: React.Key | null) => {
    const Network = find(networks, { id: Number(networkId) })
    setNetworkSearch(Network?.name ?? '')

    onRestrictionsChange({
      mediaType,
      networkId: Network?.id,
      Network,
      genreId,
      year,
      isLiveActionOnly,
      personId,
      Person,
    })
  }

  const setGenreFromPicker = (genreId: React.Key | null) => {
    const foundGenre = find(mediaTypeGenres, { id: Number(genreId) })

    onRestrictionsChange({
      mediaType,
      genreId: foundGenre?.id,
      year,
      isLiveActionOnly,
      personId,
      Person,
      networkId,
      Network,
    })
  }

  const setMoviePersonFromPicker = (item: any | undefined) => {
    const Person = item
      ? {
          id: item.tmdbId,
          name: item.name,
          profilePath: item.profilePath ?? '',
        }
      : undefined

    onRestrictionsChange({
      mediaType,
      genreId,
      year,
      isLiveActionOnly,
      personId: Person?.id,
      Person,
      networkId,
      Network,
    })
  }

  const setIsLiveActionOnlyFromPicker = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const isLiveActionOnly = e.target.value === 'true'

    onRestrictionsChange({
      mediaType,
      genreId,
      year,
      isLiveActionOnly,
      personId,
      Person,
      networkId,
      Network,
    })
  }

  return (
    <div
      className={`${isBrowse ? 'justify-center' : ''} flex flex-wrap items-end gap-4 sm:gap-8`}
    >
      <Autocomplete
        label='Year(s)'
        variant='bordered'
        size='lg'
        labelPlacement='outside'
        className='w-36'
        isClearable={!!year && year.toString() !== ''}
        selectedKey={year?.toString() ?? ''}
        onSelectionChange={setYearFromPicker}
        color='primary'
      >
        {[{ id: '', name: 'Any' }, ...years].map(yearChoice => (
          <AutocompleteItem key={yearChoice.id} textValue={yearChoice.name}>
            <span className={Number(yearChoice.id) > 10000 ? 'font-bold' : ''}>
              {yearChoice.name}
            </span>
          </AutocompleteItem>
        ))}
      </Autocomplete>
      {mediaType === MediaType.Movie && (
        <MediaPicker
          color='primary'
          size='lg'
          labelExcludesSelect={true}
          selectedItem={Person}
          onSelected={setMoviePersonFromPicker}
          mediaType={MediaType.Person}
        />
      )}
      <Select
        label='Live Action Only'
        labelPlacement='outside'
        variant='bordered'
        size='lg'
        selectedKeys={[(isLiveActionOnly || false).toString()]}
        onChange={setIsLiveActionOnlyFromPicker}
        className='w-36'
        color='primary'
        disabledKeys={Number(genreId) === TmdbGenres.Animation ? ['true'] : []}
      >
        <SelectItem key='true' value='true'>
          Yes
        </SelectItem>
        <SelectItem key='false' value='false'>
          No
        </SelectItem>
      </Select>
      {mediaType === MediaType.TvShow && (
        <Autocomplete
          label='Network'
          labelPlacement='outside'
          size='lg'
          placeholder='Type to Search...'
          variant='bordered'
          inputValue={networkSearch}
          onInputChange={setNetworkSearch}
          className='w-60'
          items={filteredNetworks}
          menuTrigger='input'
          isClearable={!!networkId && networkId.toString() !== ''}
          selectedKey={networkId?.toString() ?? ''}
          onSelectionChange={setNetworkFromPicker}
          color='primary'
        >
          {item => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
        </Autocomplete>
      )}
      <Autocomplete
        label='Genre'
        labelPlacement='outside'
        size='lg'
        variant='bordered'
        className='w-60'
        isClearable={!!genreId && genreId.toString() !== ''}
        selectedKey={genreId?.toString() ?? ''}
        onSelectionChange={setGenreFromPicker}
        color='primary'
        disabledKeys={isLiveActionOnly ? [TmdbGenres.Animation.toString()] : []}
      >
        {[{ id: '', name: 'Any', icon: undefined }, ...mediaTypeGenres].map(
          genre => (
            <AutocompleteItem
              startContent={
                <span className='mr-1 text-foreground-500'>{genre.icon}</span>
              }
              key={genre.id}
            >
              {genre.name}
            </AutocompleteItem>
          ),
        )}
      </Autocomplete>
    </div>
  )
}
