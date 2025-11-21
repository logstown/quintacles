import { MediaType, Prisma } from '@prisma/client'
import prisma from '@/lib/db'
import { Button } from '@heroui/button'
import { ListTitleBase } from '@/components/list-title-base'
import { Link } from '@heroui/link'
import { getUserListsUrl } from '@/lib/random'
import { auth } from '@clerk/nextjs/server'
import { GenreIcon } from '@/components/user-list/GenreIcon'
import { Card } from '@heroui/card'
import { unstable_cache } from 'next/cache'
import { mediaTypes } from '@/lib/mediaTypes'

export async function PopularLists({ mediaType }: { mediaType: MediaType }) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('User not found')
  }

  const listTypes = await unstable_cache(
    () =>
      prisma.restrictions.findMany({
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
          Network: true,
        },
        take: 5,
      }),
    ['popular-lists', userId, mediaType],
    { tags: [`user-mediaType-${userId}-${mediaType}`], revalidate: 60 * 60 * 1 },
  )()

  return (
    listTypes.length > 0 && (
      <div className='w-full max-w-(--breakpoint-lg)'>
        {mediaType === MediaType.Movie || mediaType === MediaType.TvShow ? (
          <h2 className='p-4 text-xl'>Choose a popular category:</h2>
        ) : (
          <h2 className='p-4 text-xl'>
            Popular TV Shows for{' '}
            <span className='font-semibold'>{mediaTypes[mediaType].display}</span>{' '}
            lists:
          </h2>
        )}
        <Card className='p-8'>
          <div className='flex flex-wrap justify-evenly gap-6'>
            {listTypes.map(listType => (
              <Button
                key={listType.slug}
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
