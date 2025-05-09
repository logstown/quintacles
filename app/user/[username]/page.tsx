import prisma from '@/lib/db'
import { Avatar } from "@heroui/avatar"
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { EditCoverImage } from '../_components/EditCoverImage'
import { getTmdbImageUrl } from '@/lib/random'
import { auth } from '@clerk/nextjs/server'
import { UserCoverImage } from '../_components/UserCoverImage'
import { MediaTypeUserLists } from '@/components/MediaTypeUserLists'
import { Metadata } from 'next'
import { cache } from 'react'
import { Skeleton } from "@heroui/skeleton"

function getUserProfile(username: string) {
  return prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: { userLists: true },
      },
    },
  })
}

const cachedProfile = cache(getUserProfile)

export async function generateMetadata(props: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { username } = params

  const profile = await cachedProfile(username)

  if (!profile) {
    return {}
  }

  const title = `${profile.displayName ?? profile.username} - Quintacles`
  const description = `@${profile.username} has ${profile._count.userLists} list${
    profile._count.userLists > 1 ? 's' : ''
  }`

  return {
    title,
    description,
    twitter: {
      card: 'summary',
      title,
      description,
      images: [profile.photoURL ?? ''],
    },
    openGraph: {
      type: 'profile',
      username: profile.username,
      title,
      description,
      images: [{ url: profile.photoURL ?? '', height: 200, width: 200 }],
      url: `https://www.quintacles.com/user/${profile.username}`,
      siteName: 'Quintacles',
    },
  }
}

export default async function UserPage(props: {
  params: Promise<{ username: string }>
}) {
  const params = await props.params

  const { username } = params

  const profile = await cachedProfile(username)

  if (!profile) {
    redirect('/')
  }

  const { userId } = await auth()

  const coverImageSrc =
    profile.coverImagePath === '/movieBackdrop.jpeg'
      ? profile.coverImagePath
      : getTmdbImageUrl(profile.coverImagePath, 'w1280')

  return (
    <div className='pb-20'>
      <div className='mx-auto max-w-screen-xl shadow-xl'>
        <div className='relative'>
          <UserCoverImage coverImagePath={coverImageSrc} />
          <Avatar
            isBordered
            src={profile.photoURL ?? undefined}
            className='absolute -bottom-[62px] left-0 right-0 ml-auto mr-auto min-h-32 min-w-32 text-large md:left-20 md:right-auto'
          />
          {userId === profile.id && (
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

      <MediaTypeUserLists userId={profile.id} username={username} />
    </div>
  )
}
