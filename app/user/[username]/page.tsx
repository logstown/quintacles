import prisma from '@/lib/db'
import { mediaTypeArrForLists } from '@/lib/mediaTypes'
import { Avatar } from '@nextui-org/avatar'
import { MediaType } from '@prisma/client'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { redirect } from 'next/navigation'

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

  return (
    <div className='px-5 pb-20'>
      <div className='mt-8 flex w-fit flex-wrap items-center justify-center gap-8 rounded-full bg-foreground-100 p-10 text-2xl shadow-inner lg:gap-16'>
        <div className='flex items-center gap-4'>
          <Avatar
            src={profile.photoURL ?? undefined}
            className='h-20 w-20 text-large'
          />
          <div>
            <div className='text-foreground-800'>{profile.displayName}</div>
            <div className='text-[80%] text-foreground-400'>
              @{profile.username}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <CalendarIcon />
          <div className='text-foreground-400'>
            Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}
          </div>
        </div>
        <div className='flex items-center gap-12'>
          <div className='flex gap-2'>
            <div className='font-bold'>{profile._count.userLists}</div>
            <div className='text-foreground-400'>
              List{profile._count.userLists > 1 && <span>s</span>}
            </div>
          </div>
        </div>
      </div>
      <div className='mt-10 flex flex-col gap-24 md:mt-16'>
        {mediaTypeArrForLists.map(mediaType => (
          <div key={mediaType.key} className='flex flex-col gap-4'>
            <div className='flex items-end gap-6 pb-4 pl-4'>
              <h1 className='text-5xl font-bold capitalize'>
                {mediaType.plural}
              </h1>
              <div>
                {/* <MediaTypeListCount mediaType={mediaType.key} uid={uid} /> */}
              </div>
            </div>
            {/* <UserListQuery
              restrictions={{
                mediaType: mediaType.key
              }}
              uid={uid}
            /> */}
          </div>
        ))}
      </div>
    </div>
  )
}
