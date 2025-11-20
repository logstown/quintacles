import { MediaTypeUserLists } from '@/components/MediaTypeUserLists'
import BlurryBlob from '@/components/animata/background/blurry-blob'
import { FlipWords } from '@/components/flip-words'
import { Metadata } from 'next'
import NextImage from 'next/image'
import { CreateButton } from './_components/CreateButton'
import { Suspense } from 'react'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Quintacles',
  description: 'Your top five!',
}

export default function Home() {
  // const deal = await prisma.listItem.findMany({
  //   take: 10,
  //   orderBy: {
  //     userLists: {
  //       _count: 'desc',
  //     },
  //   },
  // })

  // console.log(deal)

  const words = ['Movies', 'TV Shows', 'Episodes']

  return (
    <>
      <div className='absolute top-72 left-[40%] hidden sm:block'>
        <BlurryBlob
          className='opacity-20'
          firstBlobColor='bg-primary-400'
          secondBlobColor='bg-secondary-400'
        />
      </div>
      <div className='mx-auto flex max-w-(--breakpoint-lg) flex-col items-center justify-around p-10 md:flex-row'>
        <div className='drop-shadow-2xl'>
          <div className='flex flex-wrap items-center justify-center gap-2'>
            <NextImage
              alt='quintopus'
              width='150'
              className='w-[100px] md:w-[150px]'
              height='150'
              src='/octopus.png'
            />
            <h1 className='from-secondary-600 to-primary-600 bg-linear-to-br bg-clip-text text-5xl font-bold text-transparent capitalize md:text-7xl'>
              Quintacles
            </h1>
          </div>
          <div className='mb-8 flex items-center justify-center pt-5 sm:mb-0'>
            <div className='text-foreground-600 h-16 text-2xl sm:w-[400px] sm:pl-14 md:w-[500px] md:pl-6 md:text-4xl'>
              Your top five
              <br className='sm:hidden' />
              <span className='font-bold'>
                <FlipWords words={words} />
              </span>
            </div>
          </div>
        </div>
        <Suspense fallback={<CreateButton isLoading />}>
          <CreateButton />
        </Suspense>
      </div>
      <MediaTypeUserLists />
    </>
  )
}
