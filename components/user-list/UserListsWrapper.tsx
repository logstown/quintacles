export function UserListsWrapper({
  children,
  isEpisodes,
}: {
  children: React.ReactNode
  isEpisodes: boolean
}) {
  return (
    <div
      className={`flex ${isEpisodes ? 'flex-wrap justify-center gap-12 md:gap-7' : 'flex-col gap-8 sm:gap-12'}`}
    >
      {children}
    </div>
  )
}
