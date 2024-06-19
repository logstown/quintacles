import prisma from '@/lib/db'
import { mediaTypeArrForLists, mediaTypes } from '@/lib/mediaTypes'
import { Avatar } from '@nextui-org/avatar'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { EditCoverImage } from '../_components/EditCoverImage'
import { getTmdbImageUrl } from '@/lib/random'
import { currentUser } from '@clerk/nextjs/server'
import { MediaType } from '@prisma/client'
import { Suspense } from 'react'
import { UserListSkeleton } from '@/components/user-list/UserListSkeleton'
import { UserPageMediaTypeQuery } from '../_components/UserPageMediaTypeQuery'
import { UserCoverImage } from '../_components/UserCoverImage'

export default async function UserPage({
  params: { username },
}: {
  params: { username: string }
}) {
  const profilePromise = prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          userLists: true,
        },
      },
    },
  })

  const [profile, user] = await Promise.all([profilePromise, currentUser()])

  if (!profile) {
    redirect('/')
  }

  const isCurrentUser = user?.id === profile.id

  const coverImageSrc =
    profile.coverImagePath === '/movieBackdrop.jpeg'
      ? profile.coverImagePath
      : getTmdbImageUrl(profile.coverImagePath, 'w1280')

  // const stuff = await getImageStuff()
  // console.log(stuff)

  return (
    <div className='pb-20'>
      <div className='mx-auto max-w-screen-xl shadow-xl'>
        <div className='relative'>
          <UserCoverImage coverImagePath={coverImageSrc} />
          <Avatar
            isBordered
            src={profile.photoURL ?? undefined}
            className='absolute -bottom-[60px] left-0 right-0 ml-auto mr-auto min-h-32 min-w-32 text-large md:left-20 md:right-auto'
          />
          {isCurrentUser && (
            <div className='absolute bottom-5 right-5'>
              <EditCoverImage />
            </div>
          )}
        </div>
        <div className='flex flex-col items-center rounded-b-xl pb-6 pl-0 pt-20 text-center dark:border-2 dark:border-foreground-100 md:items-start md:pl-60 md:pt-4 md:text-left'>
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

      <div className='mx-auto mt-10 flex max-w-screen-lg flex-col gap-20 md:mt-16'>
        {mediaTypeArrForLists.map(mediaType => {
          const isEpisodes = mediaType.key === MediaType.TvEpisode

          return (
            <div
              className={`flex flex-col gap-10 ${isEpisodes ? '' : 'max-w-screen-lg'}`}
            >
              <h1 className='pl-4 text-5xl font-bold capitalize'>
                {mediaTypes[mediaType.key].plural}
              </h1>
              <Suspense
                key={JSON.stringify({ mediaType: mediaType.key })}
                fallback={
                  <div
                    className={`flex ${isEpisodes ? 'flex-wrap gap-12 md:gap-7' : 'flex-col gap-7 md:gap-12'}`}
                  >
                    {[1, 2, 3].map(i => (
                      <UserListSkeleton key={i} isEpisodes={isEpisodes} />
                    ))}
                  </div>
                }
              >
                <UserPageMediaTypeQuery
                  userId={profile.id}
                  username={username}
                  mediaType={mediaType.key}
                />
              </Suspense>
            </div>
          )
        })}
      </div>
    </div>
  )
}
