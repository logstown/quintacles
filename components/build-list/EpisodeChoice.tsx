'use client'

import { ListItem, MediaType } from '@prisma/client'
import { TvEpisode } from '../../lib/TmdbModels'
import { convertMediaItem, getTmdbImageUrl } from '../../lib/random'
import { AddListIdx } from './AddListIdx'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Image } from '@nextui-org/image'
import { Divider } from '@nextui-org/divider'
import { format } from 'date-fns'
import NextImage from 'next/image'
import { ItemOverview } from '../ItemOverview'

export function EpisodeChoice({
  episode,
  onItemSelected,
  idx,
  isUnselectable,
  backDropFallBack,
}: {
  episode: TvEpisode
  onItemSelected: (item: ListItem) => void
  idx: number
  isUnselectable?: boolean
  backDropFallBack: string
}) {
  const isChosen = idx >= 0

  const selectEpisode = () => {
    const item = convertMediaItem(episode, MediaType.TvEpisode)
    item.backdropPath = item.backdropPath ?? backDropFallBack
    onItemSelected(item)
  }
  return (
    <Card
      isDisabled={isChosen}
      key={episode.id}
      className={`w-fit ${isUnselectable ? 'cursor-auto' : ''}`}
      isPressable={!isChosen && !isUnselectable}
      onPress={() => selectEpisode()}
    >
      <CardHeader className='flex-col items-start pb-2 pl-5'>
        <div className='flex items-center truncate'>
          <div className='text-sm'>
            S{episode.season_number} · E{episode.episode_number}
          </div>
          <Divider className='mx-3 h-3' orientation='vertical' />
          <div className='text-tiny text-foreground-500'>
            {format(new Date(episode.air_date), 'MMM d, yyyy')}
          </div>
        </div>
        <div className='mt-1 max-w-[263px] truncate font-semibold tracking-tight'>
          {episode.name}
        </div>
      </CardHeader>
      <CardBody className='pt-0'>
        <div className='flex flex-1 flex-col items-center gap-4'>
          <AddListIdx idx={idx}>
            <Image
              unoptimized
              as={NextImage}
              width={300}
              height={169}
              alt={episode.name + ' still'}
              src={getTmdbImageUrl(episode.still_path ?? backDropFallBack, 'w300')}
            />
          </AddListIdx>
          <div className='flex flex-1 px-3 text-tiny'>
            <ItemOverview overview={episode.overview} />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
