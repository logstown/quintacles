export interface TmdbItem {
  id: number
}

export interface ScreenItem extends TmdbItem {
  readonly poster_path: string
  readonly overview: string
  readonly genre_ids: number[]
  readonly popularity: number
  readonly backdrop_path: string
  readonly vote_average: number
  readonly original_language: string
  readonly vote_count: number
  readonly tagline: string
}

interface PagedResults {
  page: number
  total_results: number
  total_pages: number
}

export interface Movie extends ScreenItem {
  readonly adult: boolean
  readonly release_date: string
  readonly original_title: string
  readonly title: string
  readonly video: boolean
}

export interface TvShow extends ScreenItem {
  readonly first_air_date: string
  readonly origin_country: string[]
  readonly name: string
  readonly original_name: string
  readonly number_of_seasons: number
  readonly last_air_date: string
}

export interface TvShowDetails extends TvShow {
  readonly seasons: Season[]
  readonly networks: any[]
  readonly created_by: any[]
}

export interface Season extends TmdbItem {
  readonly air_date: string
  readonly episode_count: number
  readonly name: string
  readonly overview: string
  readonly poster_path: string
  readonly season_number: number
  readonly episodes: TvEpisode[]
}

export interface TvEpisode extends TmdbItem {
  readonly air_date: string
  readonly episode_number: number
  readonly name: string
  readonly overview: string
  readonly production_code: string
  readonly season_number: number
  readonly show_id: number
  readonly still_path: string
  readonly vote_average: number
  readonly vote_count: number
}

export interface TmdbPerson extends TmdbItem {
  readonly profile_path: string
  readonly name: string
  readonly popularity?: number
}

export interface TmdbGenre extends TmdbItem {
  readonly name: string
}

export interface PopularPeople extends PagedResults {
  results: TmdbPerson[]
}

export interface TvShowsResponse extends PagedResults {
  results: TvShow[]
}

export interface ImagesResponse extends TmdbItem {
  backdrops: TmdbImage[]
  posters: TmdbImage[]
}

export interface MediaItemsResponse extends PagedResults {
  results: (Movie | TvShow)[]
}

export interface StillsResponse extends TmdbItem {
  stills: TmdbImage[]
}

export interface TmdbImage {
  aspect_ratio: number
  file_path: string
  height: number
  iso_639_1: null | string
  vote_average: number
  vote_count: number
  width: number
}

export interface MediaItem {
  id: number
  name: string
  poster_path: string
}

export interface AllGenres {
  movie: TmdbGenre[]
  tv: TmdbGenre[]
}

export interface TmdbNetwork {
  headquarters: string
  homepage: string
  id: number
  logo_path: string
  name: string
  origin_country: string
}

export enum TmdbGenres {
  Action = 28,
  Adventure = 12,
  Animation = 16,
  Comedy = 35,
  Crime = 80,
  Documentary = 99,
  Drama = 18,
  Family = 10751,
  Fantasy = 14,
  History = 36,
  Horror = 27,
  Music = 10402,
  Mystery = 9648,
  News = 10763,
  Romance = 10749,
  ScienceFiction = 878,
  Soap = 10766,
  Talk = 10767,
  TVMovie = 10770,
  Thriller = 53,
  War = 10752,
  Western = 37,
}
