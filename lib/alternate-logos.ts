import { MediaType } from '@prisma/client'
type AlternateLogo = {
  isListTitle: boolean
  mediaType: MediaType
  id: number
  logoIdx: number
}

export const alternateLogos: AlternateLogo[] = [
  {
    isListTitle: true,
    mediaType: MediaType.TvShow,
    id: 1409,
    logoIdx: 3,
  },
  {
    isListTitle: true,
    mediaType: MediaType.TvShow,
    id: 1421,
    logoIdx: 1,
  },
  {
    isListTitle: false,
    mediaType: MediaType.Movie,
    id: 38,
    logoIdx: 3,
  },
  {
    isListTitle: false,
    mediaType: MediaType.TvShow,
    id: 1215,
    logoIdx: 1,
  },
  {
    isListTitle: false,
    mediaType: MediaType.Movie,
    id: 339792,
    logoIdx: 1,
  },
  {
    isListTitle: false,
    mediaType: MediaType.TvShow,
    id: 1871,
    logoIdx: 1,
  },
  {
    isListTitle: false,
    mediaType: MediaType.Movie,
    id: 8967,
    logoIdx: 1,
  },
  {
    isListTitle: false,
    mediaType: MediaType.Movie,
    id: 50014,
    logoIdx: 2,
  },
  {
    isListTitle: false,
    mediaType: MediaType.Movie,
    id: 1022789,
    logoIdx: 1,
  },
  {
    isListTitle: true,
    mediaType: MediaType.TvShow,
    id: 15260,
    logoIdx: 3,
  },
  {
    isListTitle: true,
    mediaType: MediaType.TvShow,
    id: 82728,
    logoIdx: 2,
  },
  {
    isListTitle: true,
    mediaType: MediaType.TvShow,
    id: 246,
    logoIdx: 5,
  },
  {
    isListTitle: false,
    mediaType: MediaType.TvShow,
    id: 60694,
    logoIdx: 3,
  },
]
