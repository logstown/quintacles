export function UserListsWrapper({
  children,
  isEpisodes,
  isBrowse,
}: {
  children: React.ReactNode
  isEpisodes: boolean
  isBrowse?: boolean
}) {
  return (
    <div
      className={`${isEpisodes ? `episode-list-grid ${isBrowse ? 'justify-center' : ''}` : 'flex flex-col gap-8 sm:gap-12 md:gap-16'}`}
    >
      {children}
    </div>
  )
}
