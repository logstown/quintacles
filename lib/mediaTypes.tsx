import { MediaType } from '@prisma/client'
import { reject } from 'lodash'
import {
  FilmIcon,
  GalleryHorizontalEndIcon,
  GalleryVerticalEndIcon,
  TvIcon,
  UserIcon,
} from 'lucide-react'
import React from 'react'

type MediaTypeData = {
  [mediaType: string]: {
    url: string
    urlPlural: string
    display: string
    plural: string
    icon: React.ReactElement<any>
    key: MediaType
    excludeForLists?: boolean
  }
}

export const mediaTypes: MediaTypeData = {
  [MediaType.Movie]: {
    url: 'movie',
    display: 'Movie',
    urlPlural: 'movies',
    plural: 'Movies',
    icon: <FilmIcon />,
    key: MediaType.Movie,
  },
  [MediaType.TvShow]: {
    url: 'tv',
    display: 'TV Show',
    urlPlural: 'shows',
    plural: 'Shows',
    icon: <TvIcon />,
    key: MediaType.TvShow,
  },
  [MediaType.TvSeason]: {
    url: 'season',
    display: 'Season',
    urlPlural: 'seasons',
    plural: 'Seasons',
    icon: <GalleryHorizontalEndIcon />,
    key: MediaType.TvSeason,
  },
  [MediaType.TvEpisode]: {
    url: 'episode',
    display: 'Episode',
    urlPlural: 'episodes',
    plural: 'Episodes',
    icon: <GalleryVerticalEndIcon />,
    key: MediaType.TvEpisode,
  },
  [MediaType.Person]: {
    url: 'person',
    display: 'Person',
    plural: 'people',
    urlPlural: 'people',
    excludeForLists: true,
    icon: <UserIcon />,
    key: MediaType.Person,
  },
}

export const mediaTypeArr = Object.values(mediaTypes)
export const mediaTypeArrForLists = reject(mediaTypeArr, 'excludeForLists')
