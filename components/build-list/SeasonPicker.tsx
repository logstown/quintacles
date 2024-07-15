import { ListItem, MediaType } from '@prisma/client'
import { findIndex } from 'lodash'
import { SuggestionItem } from './SuggestionItem'
import { mediaTypes } from '@/lib/mediaTypes'

export function SeasonPicker({
  onItemSelected,
  listItems,
  seasons,
}: {
  onItemSelected: (item: ListItem) => void
  listItems?: ListItem[]
  seasons: ListItem[]
}) {
  return (
    <div className='suggestions-grid sm:suggestions-larger w-full'>
      {seasons.map(season => {
        const idx = findIndex(listItems, { tmdbId: season.tmdbId })
        return (
          <SuggestionItem
            key={season.tmdbId}
            item={season}
            idx={idx}
            onItemSelected={onItemSelected}
            mediaTypeIcon={mediaTypes[MediaType.TvSeason].icon}
            isUnselectable={listItems?.length === 5}
          />
        )
      })}
    </div>
  )
}
