'use client'

import { TmdbGenres } from '../lib/TmdbModels'
import { getDecades } from '../lib/random'
import { find } from 'lodash'
import { MediaType, Person } from '@prisma/client'
import { useGenres } from '@/lib/hooks'
import { RestrictionsUI } from '@/lib/models'
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete'
import { Select, SelectItem } from '@nextui-org/select'
import MediaPicker from './media-picker'

export function MovieTvCriteria({
  restrictions: {
    decade,
    genreId,
    Person,
    personId,
    isLiveActionOnly,
    mediaType,
  },
  onRestrictionsChange,
}: {
  restrictions: RestrictionsUI
  onRestrictionsChange: (restrictions: RestrictionsUI) => void
}) {
  const decades = getDecades()
  const mediaTypeGenres = useGenres(mediaType)

  const setDecadeFromPicker = (decadeId: React.Key) => {
    const foundDecade = find(decades, { id: Number(decadeId) })

    onRestrictionsChange({
      mediaType,
      genreId,
      decade: foundDecade?.id ?? 0,
      isLiveActionOnly,
      personId,
      Person,
      episodesTvShowId: '',
    })
  }

  const setGenreFromPicker = (genreId: React.Key) => {
    const foundGenre = find(mediaTypeGenres, { id: Number(genreId) })

    onRestrictionsChange({
      mediaType,
      genreId: foundGenre?.id ?? 0,
      decade,
      isLiveActionOnly,
      personId,
      Person,
      episodesTvShowId: '',
    })
  }

  const setMoviePersonFromPicker = (item: any | undefined) => {
    console.log(item)
    const Person = item
      ? {
          id: item.id,
          name: item.name,
          profilePath: item.profilePath ?? '',
        }
      : undefined

    onRestrictionsChange({
      mediaType,
      genreId,
      decade,
      isLiveActionOnly,
      personId: Person?.id ?? 0,
      Person,
      episodesTvShowId: '',
    })
  }

  const setIsLiveActionOnlyFromPicker = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const isLiveActionOnly = e.target.value === 'true'

    onRestrictionsChange({
      mediaType,
      genreId,
      decade,
      isLiveActionOnly,
      personId,
      Person,
      episodesTvShowId: '',
    })
  }

  return (
    <div className='flex flex-wrap items-end gap-4 sm:gap-8'>
      <Autocomplete
        label='Decade'
        variant='bordered'
        size='lg'
        labelPlacement='outside'
        className='w-36'
        isClearable={!!decade && decade.toString() !== ''}
        selectedKey={decade?.toString() ?? ''}
        onSelectionChange={setDecadeFromPicker}
        color='primary'
      >
        {[{ id: '', name: 'Any' }, ...decades].map(decade => (
          <AutocompleteItem key={decade.id}>{decade.name}</AutocompleteItem>
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
                <span className='text-neutral-400'>{genre.icon}</span>
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
