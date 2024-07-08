import { MediaTypeUserLists } from '@/components/MediaTypeUserLists'
import BlurryBlob from '@/components/animata/background/blurry-blob'
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

  const words = ['Movies', 'TV Shows', 'Episodes']

  return (
    <>
      <div className='absolute left-[40%] top-[40%] hidden sm:block'>
        <BlurryBlob
          className='opacity-20'
          firstBlobColor='bg-primary-400'
          secondBlobColor='bg-secondary-400'
        />
      </div>
      <div className='mx-auto flex max-w-screen-lg flex-col items-center justify-around p-10 md:flex-row'>
        <div className='drop-shadow-2xl'>
          <div className='flex flex-wrap items-center justify-center gap-2'>
            <NextImage
              unoptimized
              alt='octopus'
              width='150'
              className='w-[100px] md:w-[150px]'
              height='150'
              src='/octopus.png'
            />
            <h1 className='bg-gradient-to-br from-secondary-600 to-primary-600 bg-clip-text text-5xl font-bold capitalize text-transparent md:text-7xl'>
              Quintacles
            </h1>
          </div>
          <div className='mb-8 flex items-center justify-center pt-5 sm:mb-0'>
            <div className='h-16 text-2xl text-foreground-600 sm:w-[400px] sm:pl-14 md:w-[500px] md:pl-6 md:text-4xl'>
              Your top five
              <br className='sm:hidden' />
              <span className='font-bold'>
                <FlipWords words={words} />
              </span>
            </div>
          </div>
        </div>
        <Button
          className='bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-2xl md:rounded-3xl md:p-10 md:text-2xl'
          size='lg'
          as={Link}
          href='/create/criteria'
          startContent={<PlusIcon />}
        >
          Create List
        </Button>
      </div>
      <MediaTypeUserLists />
    </>
  )
}
