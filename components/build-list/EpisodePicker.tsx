'use client'

import { TvEpisode } from '../../lib/TmdbModels'
import { useMemo, useState } from 'react'
import { filter, flow, orderBy, take } from 'lodash/fp'
import { words, findIndex } from 'lodash'
import { EpisodeChoice } from './EpisodeChoice'
import { SearchIcon } from 'lucide-react'
import { ListItem, MediaType } from '@prisma/client'
import { useScrollAfter5Items } from '@/lib/hooks'
import { Input } from '@nextui-org/input'
import { Select, SelectItem } from '@nextui-org/select'
import { EpisodeData } from '@/lib/random'

const doesWordStartIncludeTerm = (term: string, str: string): boolean => {
  const strWords = words(str)
  return strWords.some(w => w.toLowerCase().startsWith(term.toLowerCase()))
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
  tvShow: ListItem
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
      filter(ep =>
        season === 'All' ? true : ep.season_number === Number(season),
      ),
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
    } else {
      setSortEpsBy(SortBy.EpisodeOrder.toString())
    }
  }
  const handleSortEpsByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortEpsBy(e.target.value)
  }

  return (
    <div className='flex flex-col gap-12'>
      <div className='flex flex-wrap items-end justify-center gap-4'>
        <Input
          startContent={<SearchIcon size={15} />}
          isClearable
          label='Search Episodes'
          labelPlacement='outside'
          variant='bordered'
          value={search}
          className='min-w-[200px] max-w-[400px] flex-1'
          onValueChange={setSearch}
        />
        <div className='flex gap-4'>
          <Select
            label='Season'
            variant='bordered'
            labelPlacement='outside'
            placeholder='Select an animal'
            selectedKeys={[season]}
            className='w-28'
            onChange={handleSeasonChange}
          >
            {['All', ...seasons].map(s => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </Select>
          <Select
            label='Sort By'
            variant='bordered'
            labelPlacement='outside'
            selectedKeys={[sortEpsBy]}
            className='w-40'
            onChange={handleSortEpsByChange}
          >
            <SelectItem
              key={SortBy.Popularity}
              value={SortBy.Popularity.toString()}
            >
              Popular
            </SelectItem>
            <SelectItem
              key={SortBy.EpisodeOrder}
              value={SortBy.EpisodeOrder.toString()}
            >
              Episode Order
            </SelectItem>
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
              backDropFallBack={tvShow.posterPath ?? ''}
              key={episode.id}
              onItemSelected={onItemSelected}
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
