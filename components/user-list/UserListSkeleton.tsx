import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/card'
import { Skeleton } from '@nextui-org/skeleton'
import { BackdropCollageStraight, PosterCollageStraight } from './PosterCollage'

export function UserListSkeleton({ isEpisodes }: { isEpisodes: boolean }) {
  return (
    <Card shadow='lg' className='w-fit overflow-visible p-0 sm:p-2'>
      <CardHeader className={`pl-4 md:py-6`}>
        <Skeleton className='rounded-lg'>
          <div className='flex w-full items-baseline gap-3 truncate'>
            <h2
              className={`text-2xl font-semibold tracking-tight ${isEpisodes ? 'max-w-[267px]' : 'sm:text-3xl md:text-4xl lg:text-5xl'}`}
            >
              Dummy Title Time
            </h2>
          </div>
        </Skeleton>
      </CardHeader>
      <CardBody
        className={`overflow-visible ${isEpisodes ? 'pt-0' : 'px-1 pb-2 pt-1 sm:px-3'}`}
      >
        {isEpisodes ? <BackdropCollageStraight /> : <PosterCollageStraight />}
      </CardBody>
      <CardFooter className='flex justify-end'>
        <Skeleton className='w-36' />
      </CardFooter>
    </Card>
  )
}
