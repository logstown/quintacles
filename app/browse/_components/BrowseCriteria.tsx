'use client'

import MediaPicker from '@/components/media-picker'
import { MovieTvCriteria } from '@/components/movie-tv-criteria'
import { mediaTypes } from '@/lib/mediaTypes'
import { RestrictionsUI } from '@/lib/models'
import { Divider } from '@nextui-org/divider'
import { Select, SelectItem } from '@nextui-org/select'
import { Switch } from '@nextui-org/switch'
import { ListItem, MediaType } from '@prisma/client'
import { forEach, isEqual, map, omitBy, set } from 'lodash'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

type SearchParamPair = {
  name: string
  value: string | undefined
}

export function BrowseCriteria({
  restrictionsFromParent,
  sortByFromParent,
  exactMatchFromParent,
}: {
  restrictionsFromParent: RestrictionsUI
  sortByFromParent: 'lastUserAddedAt' | 'users'
  exactMatchFromParent: boolean
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [restrictions, setRestrictions] = useState<RestrictionsUI>(
    restrictionsFromParent,
  )
  const [sortBy, setSortBy] = useState(sortByFromParent)
  const [exactMatch, setexactMatch] = useState(exactMatchFromParent)

  if (!isEqual(restrictionsFromParent, restrictions)) {
    setRestrictions(restrictionsFromParent)
  }

  if (sortByFromParent !== sortBy) {
    setSortBy(sortByFromParent)
  }

  if (exactMatchFromParent !== exactMatch) {
    setexactMatch(exactMatchFromParent)
  }

  const createQueryString = useCallback(
    (nameValuePairs: SearchParamPair[]) => {
      const params = new URLSearchParams(searchParams.toString())
      forEach(nameValuePairs, ({ name, value }) => {
        if (value !== undefined && value !== 'false') {
          params.set(name, value)
        } else {
          params.delete(name)
        }
      })

      return params.toString()
    },
    [searchParams],
  )

  const setRoute = (pairs: SearchParamPair[]) => {
    const url = pathname + '?' + createQueryString(pairs)
    router.replace(url, { scroll: false })
  }

  const setSortByFromPicker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'lastUserAddedAt' | 'users'

    setSortBy(value)
    const pair = { name: 'sortBy', value }
    setRoute([pair])
  }

  const tvShowSelected = (item: ListItem | undefined) => {
    const pair = { name: 'tvShowId', value: item?.tmdbId.toString() }
    setRoute([pair])
  }

  const restrictionsChange = (newRestrictions: RestrictionsUI) => {
    setRestrictions(newRestrictions)
    const filteredRestrictions = omitBy(
      newRestrictions,
      (value, key) => key === 'mediaType',
    )
    const pairs = map(filteredRestrictions, (value, key) => ({
      name: key,
      value: value?.toString(),
    }))

    setRoute(pairs)
  }

  const setExactMatchFromPicker = (value: boolean) => {
    setexactMatch(value)

    const pair = { name: 'exactMatch', value: value ? 'true' : undefined }
    setRoute([pair])
  }

  return (
    <div className='flex flex-col items-start gap-10'>
      <h1 className='text-3xl font-semibold'>
        Browse{' '}
        <span className='capitalize text-primary'>
          {mediaTypes[restrictions.mediaType].plural}
        </span>
      </h1>
      <div className='flex flex-wrap items-baseline gap-4 sm:gap-8'>
        <Select
          label='Sort By'
          labelPlacement='outside'
          variant='bordered'
          disallowEmptySelection={true}
          size='lg'
          selectedKeys={[sortBy]}
          onChange={setSortByFromPicker}
          className='w-32'
          color='primary'
        >
          <SelectItem key='lastUserAddedAt' value='lastUserAddedAt'>
            Latest
          </SelectItem>
          <SelectItem key='users' value='users'>
            Popular
          </SelectItem>
        </Select>
        <Divider className='h-8' orientation='vertical' />
        {restrictions.mediaType === MediaType.TvEpisode ? (
          <MediaPicker
            labelExcludesSelect={true}
            size='lg'
            color='primary'
            selectedItem={restrictions.EpisodesTvShow}
            onSelected={tvShowSelected}
            mediaType={MediaType.TvShow}
          />
        ) : (
          <>
            <MovieTvCriteria
              restrictions={restrictions}
              onRestrictionsChange={restrictionsChange}
            />
            <Switch isSelected={exactMatch} onValueChange={setExactMatchFromPicker}>
              Exact Match
            </Switch>
          </>
        )}
      </div>
    </div>
  )
}
