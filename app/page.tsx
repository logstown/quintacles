import { MediaTypeUserLists } from '@/components/MediaTypeUserLists'
import { FlipWords } from '@/components/flip-words'
import NextImage from 'next/image'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // const deal = await prisma.listItem.findMany({
  //   take: 10,
  //   orderBy: {
  //     userLists: {
  //       _count: 'desc',
  //     },
  //   },
  // })

  // console.log(deal)

  const words = ['Movies', 'Shows', 'Episodes']

  return (
    <>
      <div>
        <div className='flex flex-wrap items-center justify-center gap-2'>
          <NextImage
            alt='octopus'
            width='150'
            className='w-[100px] md:w-[150px]'
            height='150'
            src='/octopus.png'
          />
          <h1 className='bg-gradient-to-br from-secondary-500 to-primary-500 bg-clip-text text-5xl font-bold capitalize text-transparent md:text-7xl'>
            Quintacles
          </h1>
        </div>
        <div className='flex items-center justify-center pt-5'>
          <div className='h-16 w-[450px] pl-16 text-2xl font-normal text-foreground-600 md:pl-6 md:text-4xl'>
            Your Top Five
            <FlipWords words={words} />
          </div>
        </div>
      </div>
      <MediaTypeUserLists />
    </>
  )
}
