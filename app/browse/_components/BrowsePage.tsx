'use client'

import { ListTitle } from '@/app/create/criteria/_components/list-title'
import { UserListQuery } from '@/components/UserListQuery'
import { ListTitleBase } from '@/components/list-title-base'
import MediaPicker from '@/components/media-picker'
import { MovieTvCriteria } from '@/components/movie-tv-criteria'
import { mediaTypes } from '@/lib/mediaTypes'
import { RestrictionsUI } from '@/lib/models'
import { Divider } from '@nextui-org/divider'
import { Select, SelectItem } from '@nextui-org/select'
import { Switch } from '@nextui-org/switch'
import { ListItem, MediaType } from '@prisma/client'
import { forEach, map, omitBy } from 'lodash'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

type SearchParamPair = {
  name: string
  value: string | undefined
}

export function BrowsePage({
  restrictionsFromParent,
  sortBy,
  exactMatch,
}: {
  restrictionsFromParent: RestrictionsUI
  sortBy: 'lastUserAddedAt' | 'users'
  exactMatch: boolean
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [restrictions, setRestrictions] = useState<RestrictionsUI>(
    restrictionsFromParent,
  )

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
    console.log('setting route', url)

    router.replace(url, { scroll: false })
  }

  const setSortByFromPicker = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pair = { name: 'sortBy', value: e.target.value }
    setRoute([pair])
  }

  const tvShowSelected = (item: ListItem | undefined) => {
    // setSearchParams(prev => {
    //     if (item) {
    //       prev.set('episodeTvShowId', item.tmdbId.toString())
    //     } else {
    //       prev.delete('episodeTvShowId')
    //     }
    //     return prev
    //   })
    console.log(item)
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

    console.log(pairs)
    setRoute(pairs)
  }

  const setExactMatchFromPicker = (value: boolean) => {
    console.log(value)

    const pair = { name: 'exactMatch', value: value ? 'true' : undefined }
    setRoute([pair])
  }

  return (
    <>
      <h1 className='text-3xl font-semibold'>
        Explore{' '}
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
    </>
  )
}
