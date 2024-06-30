import { MediaTypeUserLists } from '@/components/MediaTypeUserLists'
import { FlipWords } from '@/components/flip-words'
import { Button } from '@nextui-org/button'
import { PlusIcon } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'

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
      <div className='mx-auto flex max-w-screen-lg flex-col items-center justify-around p-10 md:flex-row'>
        <div>
          <div className='flex flex-wrap items-center justify-center gap-2'>
            <NextImage
              unoptimized
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
        <Button
          className='bg-gradient-to-br from-primary-500 to-secondary-500 text-white md:rounded-3xl md:p-10 md:text-2xl'
          size='lg'
          as={Link}
          href='/create/criteria'
          startContent={<PlusIcon />}
          variant='shadow'
        >
          Create List
        </Button>
      </div>
      <MediaTypeUserLists />
    </>
  )
}
