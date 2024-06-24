'use client'

import MediaPicker from '@/components/media-picker'
import { MovieTvCriteria } from '@/components/movie-tv-criteria'
import { mediaTypeArrForLists } from '@/lib/mediaTypes'
import { RestrictionsUI } from '@/lib/models'
import { Button } from '@nextui-org/button'
import { Select, SelectItem } from '@nextui-org/select'
import { Switch } from '@nextui-org/switch'
import { Tab, Tabs } from '@nextui-org/tabs'
import { ListItem, MediaType, User } from '@prisma/client'
import { forEach, isEqual, map, omitBy, set } from 'lodash'
import { FilterIcon, SlidersHorizontalIcon } from 'lucide-react'
import Link from 'next/link'
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
  user,
}: {
  restrictionsFromParent: RestrictionsUI
  sortByFromParent: 'lastUserAddedAt' | 'users'
  exactMatchFromParent: boolean
  user?: User
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [restrictions, setRestrictions] = useState<RestrictionsUI>(
    restrictionsFromParent,
  )
  const [sortBy, setSortBy] = useState(sortByFromParent)
  const [exactMatch, setexactMatch] = useState(exactMatchFromParent)
  const [showCriteria, setCriteria] = useState(false)

  const baseUrl = user ? `/user/${user.username}` : '/browse'

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
    const pair = { name: 'episodesTvShowId', value: item?.tmdbId.toString() }
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
    <div className='flex w-full flex-col items-center gap-10'>
      <div className='flex w-full max-w-screen-lg flex-col items-center justify-center gap-8 sm:flex-row sm:items-baseline sm:gap-12'>
        <Tabs aria-label='Options' fullWidth selectedKey={pathname} size='lg'>
          {mediaTypeArrForLists.map(mediaType => (
            <Tab
              key={`${baseUrl}/${mediaType.urlPlural}`}
              as={Link}
              title={mediaType.plural}
              href={`${baseUrl}/${mediaType.urlPlural}`}
            />
          ))}
        </Tabs>
        <div className='flex items-baseline gap-12'>
          <Select
            label='Sort By'
            labelPlacement='outside'
            variant='bordered'
            disallowEmptySelection={true}
            size='lg'
            selectedKeys={[sortBy]}
            onChange={setSortByFromPicker}
            className='w-32 shrink-0'
            color='primary'
          >
            <SelectItem key='lastUserAddedAt' value='lastUserAddedAt'>
              Latest
            </SelectItem>
            <SelectItem key='users' value='users'>
              Popular
            </SelectItem>
          </Select>
          <Switch isSelected={showCriteria} onValueChange={setCriteria} size='lg'>
            <SlidersHorizontalIcon />
          </Switch>
        </div>
      </div>
      {showCriteria && (
        <div className='flex flex-wrap items-baseline justify-center gap-4 sm:gap-8'>
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
                isBrowse={true}
                restrictions={restrictions}
                onRestrictionsChange={restrictionsChange}
              />
              <Switch
                isSelected={exactMatch}
                onValueChange={setExactMatchFromPicker}
              >
                Exact
              </Switch>
            </>
          )}
        </div>
      )}
    </div>
  )
}
