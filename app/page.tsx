import { subtitle } from '@/components/primitives'
import { MediaTypeUserLists } from '@/components/MediaTypeUserLists'
import { FlipWords } from '@/components/flip-words'

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
      <div className='flex justify-center'>
        <h1 className='bg-gradient-to-b from-primary-500 to-secondary-500 bg-clip-text text-4xl font-bold capitalize text-transparent md:text-7xl'>
          Media Ranker
        </h1>
      </div>
      <div className='flex items-center justify-center pt-5'>
        <div className='h-16 w-[450px] pl-12 text-2xl font-normal text-foreground-600 md:pl-6 md:text-4xl'>
          Your Top Five
          <FlipWords words={words} />
        </div>
      </div>
      <MediaTypeUserLists />
    </>
  )
}
