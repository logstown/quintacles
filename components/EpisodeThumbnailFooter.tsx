import { CardFooter } from '@nextui-org/card'

export function EpisodeThumbnailFooter({ children }: { children: React.ReactNode }) {
  return (
    <CardFooter className='absolute bottom-0 z-10 overflow-hidden bg-slate-900/60 py-2 text-sm text-neutral-200'>
      {children}
    </CardFooter>
  )
}
