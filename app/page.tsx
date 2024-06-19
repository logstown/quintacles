import { subtitle } from '@/components/primitives'
import { MediaTypeUserLists } from '@/components/MediaTypeUserLists'

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

  return (
    <>
      <div className='flex flex-col items-center gap-0 text-center'>
        <h1 className='bg-gradient-to-b from-danger-500 to-secondary-500 bg-clip-text text-7xl font-bold capitalize text-transparent'>
          Media Ranker
        </h1>
        <h2 className={subtitle({ class: 'mt-4' })}>
          Your top 5 movies, TV shows, and more!
        </h2>
      </div>
      <MediaTypeUserLists />
    </>
  )
}
