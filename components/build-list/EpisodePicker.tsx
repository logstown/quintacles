'use client'

import { TvEpisode } from '../../lib/TmdbModels'
import { useMemo, useState } from 'react'
import { filter, flow, orderBy, take } from 'lodash/fp'
import { findIndex } from 'lodash'
import { EpisodeChoice } from './EpisodeChoice'
import { SearchIcon } from 'lucide-react'
import { ListItem, TvShowLite } from '@prisma/client'
import { useScrollAfter5Items } from '@/lib/hooks'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { EpisodeData } from '@/lib/models'

const doesWordStartIncludeTerm = (term: string, str: string): boolean => {
  return str.toLowerCase().includes(term.toLowerCase())
}

enum SortBy {
  Popularity = 'p',
  EpisodeOrder = 'e',
}

export function EpisodePicker({
  tvShow,
  onItemSelected,
  listItems,
  episodeData: { allEpisodes, seasons },
}: {
  tvShow: TvShowLite
  onItemSelected: (item: ListItem) => void
  listItems: ListItem[]
  episodeData: EpisodeData
}) {
  const [sortEpsBy, setSortEpsBy] = useState(SortBy.Popularity.toString())
  const [search, setSearch] = useState('')
  const [season, setSeason] = useState('All')

  const episodes = useMemo(() => {
    return flow(
      filter(
        (ep: TvEpisode) =>
          doesWordStartIncludeTerm(search, ep.name) ||
          doesWordStartIncludeTerm(search, ep.overview),
      ),
      filter(ep => (season === 'All' ? true : ep.season_number === Number(season))),
      orderBy(
        ep =>
          sortEpsBy === SortBy.Popularity
            ? ep.vote_average
            : ep.season_number * 1000 + ep.episode_number,
        [sortEpsBy === SortBy.Popularity ? 'desc' : 'asc'],
      ),
      take(season === 'All' ? 20 : 1000),
    )(allEpisodes) as TvEpisode[]
  }, [allEpisodes, search, season, sortEpsBy])

  useScrollAfter5Items(listItems?.length)

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeason = e.target.value
    setSeason(newSeason)

    if (newSeason === 'All') {
      setSortEpsBy(SortBy.Popularity.toString())
    }
  }

  const handleSortEpsByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortEpsBy(e.target.value)
  }

  const onEpisodeSelected = (item: ListItem) => {
    onItemSelected(item)
    setTimeout(() => setSearch(''), 2000)
  }

  return (
    <div className='flex flex-col gap-12'>
      <div className='flex flex-wrap items-end justify-center gap-4'>
        <Input
          startContent={<SearchIcon size={15} />}
          isClearable
          label='Search Episodes'
          labelPlacement='outside'
          variant='faded'
          value={search}
          className='min-w-[200px] max-w-[400px] flex-1'
          onValueChange={setSearch}
        />
        <div className='flex gap-4'>
          <Select
            label='Season'
            variant='faded'
            labelPlacement='outside'
            placeholder='Select an animal'
            selectedKeys={[season]}
            className='w-28'
            onChange={handleSeasonChange}
          >
            {['All', ...seasons].map(s => (
              <SelectItem key={s}>{s}</SelectItem>
            ))}
          </Select>
          <Select
            label='Sort By'
            variant='faded'
            labelPlacement='outside'
            selectedKeys={[sortEpsBy]}
            className='w-40'
            onChange={handleSortEpsByChange}
          >
            <SelectItem key={SortBy.Popularity}>Popular</SelectItem>
            <SelectItem key={SortBy.EpisodeOrder}>Episode Order</SelectItem>
          </Select>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gap: '2rem',
          justifyContent: 'center',
          gridTemplateColumns: 'repeat(auto-fit, 296px)', // this could be 324px but I wanted it to fit the screen
        }}
      >
        {episodes.map(episode => {
          const idx = findIndex(listItems, { tmdbId: episode.id })
          return (
            <EpisodeChoice
              backDropFallBack={tvShow.backdropPath ?? ''}
              key={episode.id}
              onItemSelected={onEpisodeSelected}
              episode={episode}
              idx={idx}
              isUnselectable={listItems?.length === 5}
            />
          )
        })}
      </div>
    </div>
  )
}
