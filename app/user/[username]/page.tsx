import { UserListQuery } from '@/components/UserListQuery'
import { UserListSkeleton } from '@/components/user-list/UserListSkeleton'
import { getImageStuff } from '@/lib/TmdbService'
import prisma from '@/lib/db'
import { mediaTypeArrForLists } from '@/lib/mediaTypes'
import { Avatar } from '@nextui-org/avatar'
import { MediaType } from '@prisma/client'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { EditCoverImage } from '../_components/EditCoverImage'
import { getTmdbImageUrl } from '@/lib/random'
import { currentUser } from '@clerk/nextjs/server'

export default async function UserPage({
  params: { username },
}: {
  params: { username: string }
}) {
  const profile = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          userLists: true,
        },
      },
    },
  })

  if (!profile) {
    redirect('/')
  }

  const user = await currentUser()
  const isCurrentUser = user?.id === profile.id

  const coverImageSrc =
    profile.coverImagePath === '/movieBackdrop.jpeg'
      ? profile.coverImagePath
      : getTmdbImageUrl(profile.coverImagePath, 'w1280')

  // const stuff = await getImageStuff()
  // console.log(stuff)

  return (
    <div className='pb-20'>
      <div className='mx-auto max-w-screen-lg'>
        <div className='relative'>
          <img
            src={coverImageSrc}
            alt='cover'
            className=' h-80 w-full rounded-t-xl object-cover shadow-xl'
          />
          <Avatar
            isBordered
            src={profile.photoURL ?? undefined}
            className='absolute -bottom-[60px] left-0 right-0 ml-auto mr-auto min-h-32 min-w-32 text-large md:left-20 md:right-auto '
          />
          {isCurrentUser && (
            <div className='absolute bottom-5 right-5'>
              <EditCoverImage />
            </div>
          )}
        </div>
        <div className='flex flex-col items-center rounded-b-xl bg-foreground-100 pb-6 pl-0 pt-20 text-center md:items-start md:pl-60 md:pt-4 md:text-left'>
          <div className='flex flex-wrap items-baseline gap-4 font-semibold'>
            <div className='whitespace-nowrap text-3xl text-foreground-800'>
              {profile.displayName}
            </div>
            <div className='text-xl text-foreground-400'>@{profile.username}</div>
          </div>
          <div className='flex gap-4 pt-4'>
            <div className='flex items-end gap-2'>
              <CalendarIcon />
              <div className='text-foreground-400'>
                Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}
              </div>
            </div>
            <div className='flex gap-2'>
              <div className='font-bold'>{profile._count.userLists}</div>
              <div className='text-foreground-400'>
                List{profile._count.userLists > 1 && <span>s</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto mt-10 flex max-w-screen-lg flex-col gap-24 md:mt-16'>
        {mediaTypeArrForLists.map(mediaType => (
          <div key={mediaType.key} className='flex flex-col gap-4'>
            <div className='flex items-end gap-6 pb-4 pl-4'>
              <h1 className='text-5xl font-bold capitalize'>{mediaType.plural}</h1>
              <div>
                {/* <MediaTypeListCount mediaType={mediaType.key} uid={uid} /> */}
              </div>
            </div>
            <Suspense
              fallback={
                <div
                  className={`flex ${mediaType.key === MediaType.TvEpisode ? 'flex-wrap gap-12 md:gap-7' : 'flex-col gap-7 md:gap-12'}`}
                >
                  {[1, 2, 3, 4].map(i => (
                    <UserListSkeleton
                      key={i}
                      isEpisodes={mediaType.key === MediaType.TvEpisode}
                    />
                  ))}{' '}
                </div>
              }
            >
              <UserListQuery
                restrictions={{ mediaType: mediaType.key }}
                userId={profile.id}
                sortBy='lastUserAddedAt'
              />
            </Suspense>
          </div>
        ))}
      </div>
    </div>
  )
}
