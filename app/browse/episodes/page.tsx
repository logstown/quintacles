import EpisodesBrowse from '../_components/EpisodesPage'

export default async function EpisodesBrowsePage({
  searchParams,
}: {
  searchParams: { sortBy: string; exactMatch: string; tvShowId: string }
}) {
  return <EpisodesBrowse searchParams={searchParams} />
}
