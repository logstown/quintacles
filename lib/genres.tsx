import { filter, sortBy, find } from 'lodash'
import {
  SwordsIcon,
  BrushIcon,
  LaughIcon,
  SirenIcon,
  VideoIcon,
  DramaIcon,
  PersonStanding,
  BabyIcon,
  SearchIcon,
  NewspaperIcon,
  CctvIcon,
  RocketIcon,
  ShowerHeadIcon,
  Armchair,
  MapIcon,
  TentTreeIcon,
  TelescopeIcon,
  CastleIcon,
  HistoryIcon,
  GhostIcon,
  MusicIcon,
  HeartIcon,
  TvIcon,
  LoaderIcon,
} from 'lucide-react'
import { Genre } from './models'
import { MediaType } from '@prisma/client'

const genres: ReadonlyArray<Genre> = [
  {
    id: 10759,
    mediaTypes: [MediaType.TvShow],
    name: 'Action & Adventure',
    icon: <SwordsIcon />,
  },
  {
    id: 16,
    mediaTypes: [MediaType.TvShow, MediaType.Movie],
    name: 'Animation',
    icon: <BrushIcon />,
  },
  {
    id: 35,
    mediaTypes: [MediaType.TvShow, MediaType.Movie],
    name: 'Comedy',
    icon: <LaughIcon />,
  },
  {
    id: 80,
    mediaTypes: [MediaType.TvShow, MediaType.Movie],
    name: 'Crime',
    icon: <SirenIcon />,
  },
  {
    id: 99,
    mediaTypes: [MediaType.TvShow, MediaType.Movie],
    name: 'Documentary',
    icon: <VideoIcon />,
  },
  {
    id: 18,
    mediaTypes: [MediaType.TvShow, MediaType.Movie],
    name: 'Drama',
    icon: <DramaIcon />,
  },
  {
    id: 10751,
    mediaTypes: [MediaType.TvShow, MediaType.Movie],
    name: 'Family',
    icon: <PersonStanding />,
  },
  {
    id: 10762,
    mediaTypes: [MediaType.TvShow],
    name: 'Kids',
    icon: <BabyIcon />,
  },
  {
    id: 9648,
    mediaTypes: [MediaType.TvShow, MediaType.Movie],
    name: 'Mystery',
    icon: <SearchIcon />,
  },
  {
    id: 10763,
    mediaTypes: [MediaType.TvShow],
    name: 'News',
    icon: <NewspaperIcon />,
  },
  {
    id: 10764,
    mediaTypes: [MediaType.TvShow],
    name: 'Reality',
    icon: <CctvIcon />,
  },
  {
    id: 10765,
    mediaTypes: [MediaType.TvShow],
    name: 'Sci-Fi & Fantasy',
    icon: <RocketIcon />,
  },
  {
    id: 10766,
    mediaTypes: [MediaType.TvShow],
    name: 'Soap',
    icon: <ShowerHeadIcon />,
  },
  {
    id: 10767,
    mediaTypes: [MediaType.TvShow],
    name: 'Talk',
    icon: <Armchair />,
  },
  {
    id: 10768,
    mediaTypes: [MediaType.TvShow],
    name: 'War & Politics',
    icon: <MapIcon />,
  },
  {
    id: 37,
    mediaTypes: [MediaType.TvShow, MediaType.Movie],
    name: 'Western',
    icon: <TentTreeIcon />,
  },
  {
    id: 28,
    mediaTypes: [MediaType.Movie],
    name: 'Action',
    icon: <SwordsIcon />,
  },
  {
    id: 12,
    mediaTypes: [MediaType.Movie],
    name: 'Adventure',
    icon: <TelescopeIcon />,
  },
  {
    id: 14,
    mediaTypes: [MediaType.Movie],
    name: 'Fantasy',
    icon: <CastleIcon />,
  },
  {
    id: 36,
    mediaTypes: [MediaType.Movie],
    name: 'History',
    icon: <HistoryIcon />,
  },
  {
    id: 27,
    mediaTypes: [MediaType.Movie],
    name: 'Horror',
    icon: <GhostIcon />,
  },
  {
    id: 10402,
    mediaTypes: [MediaType.Movie],
    name: 'Music',
    icon: <MusicIcon />,
  },
  {
    id: 10749,
    mediaTypes: [MediaType.Movie],
    name: 'Romance',
    icon: <HeartIcon />,
  },
  {
    id: 878,
    mediaTypes: [MediaType.Movie],
    name: 'Science Fiction',
    icon: <RocketIcon />,
  },
  {
    id: 10770,
    mediaTypes: [MediaType.Movie],
    name: 'TV Movie',
    icon: <TvIcon />,
  },
  {
    id: 53,
    mediaTypes: [MediaType.Movie],
    name: 'Thriller',
    icon: <LoaderIcon />,
  },
  {
    id: 10752,
    mediaTypes: [MediaType.Movie],
    name: 'War',
    icon: <MapIcon />,
  },
]

export const getGenres = (mediaType: MediaType): Genre[] => {
  const filtered = filter(genres, x => x.mediaTypes.includes(mediaType))
  return sortBy(filtered, 'name')
}

export const getGenreById = (id: number): Genre | undefined =>
  find(genres, { id })
