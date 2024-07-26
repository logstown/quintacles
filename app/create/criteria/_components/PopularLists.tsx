import { MediaType, Prisma } from '@prisma/client'
import prisma from '@/lib/db'
import { Button } from '@nextui-org/button'
import { ListTitleBase } from '@/components/list-title-base'
import Link from 'next/link'
import { getUserListsUrl } from '@/lib/random'
import { auth } from '@clerk/nextjs/server'
import { GenreIcon } from '@/components/user-list/GenreIcon'
import { Card } from '@nextui-org/card'

export async function PopularLists({ mediaType }: { mediaType: MediaType }) {
  const { userId } = auth()

  if (!userId) {
    throw new Error('User not found')
  }

  const listTypes = await prisma.restrictions.findMany({
    where: {
      mediaType,
      userLists: {
        none: {
          users: {
            some: { userId },
          },
        },
      },
    },
    orderBy: {
      userLists: { _count: Prisma.SortOrder.desc },
    },
    include: {
      Person: true,
      EpisodesTvShow: true,
    },
    take: 5,
  })

  return (
    listTypes.length > 0 && (
      <div className='w-full max-w-screen-lg'>
        <h2 className='p-4 text-xl'>Choose a popular category:</h2>
        <Card className='p-8'>
          <div className='flex flex-wrap justify-evenly'>
            {listTypes.map(listType => (
              <Button
                variant='flat'
                color='primary'
                size='lg'
                as={Link}
                className='p-8 text-xl'
                endContent={<GenreIcon genreId={listType.genreId} />}
                href={getUserListsUrl(listType)}
              >
                <ListTitleBase restrictions={listType} />
              </Button>
            ))}
          </div>
        </Card>
        <p className='mt-8 text-center text-2xl font-semibold'>or</p>
      </div>
    )
  )
}
