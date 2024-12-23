import { Skeleton } from '@nextui-org/skeleton'

export default function ListLoading() {
  const arr = [1, 2, 3, 4, 5]
  return (
    <main>
      <div className='mx-8 mb-8 flex flex-col items-center gap-4'>
        <Skeleton className='w-[60%] rounded-lg text-center text-5xl font-semibold capitalize tracking-tight sm:text-6xl lg:text-7xl'>
          dummy
        </Skeleton>
        <div className='flex flex-none items-center gap-3'>
          <div>
            <Skeleton className='flex h-12 w-12 rounded-full' />
          </div>
          <div>
            <Skeleton className='h-3 w-[180px] rounded-lg' />
          </div>
        </div>
      </div>
      <div className='mx-auto flex max-w-screen-2xl flex-col items-center gap-10'>
        {arr.map(i => (
          <Skeleton
            className='aspect-[672/587] w-full max-w-screen-sm rounded-xl lg:aspect-[26.66666/9] lg:w-full lg:max-w-none'
            key={i}
          />
        ))}
      </div>
    </main>
  )
}
