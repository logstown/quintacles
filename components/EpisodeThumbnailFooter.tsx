import { CardFooter } from "@heroui/card"

export function EpisodeThumbnailFooter({
  children,
  isSeasons,
}: {
  children: React.ReactNode
  isSeasons?: boolean
}) {
  return (
    <CardFooter
      className={`absolute bottom-0 z-10 justify-center overflow-hidden rounded-b-xl bg-slate-900/60 py-2 text-sm text-neutral-200`}
    >
      {children}
    </CardFooter>
  )
}
