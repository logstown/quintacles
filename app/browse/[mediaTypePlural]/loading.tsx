import { Skeleton } from "@heroui/skeleton"

export default function Loading() {
  return (
    <div className='mx-auto flex w-full flex-col items-center gap-8 pb-20'>
      <Skeleton>
        <h1 className='rounded-lg text-6xl font-semibold'>Browse</h1>
      </Skeleton>
      <Skeleton className='h-[137.5px] w-full max-w-(--breakpoint-lg) rounded-lg' />
    </div>
  )
}
