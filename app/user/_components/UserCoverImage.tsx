'use client'

export function UserCoverImage({ coverImagePath }: { coverImagePath: string }) {
  return (
    <img
      src={coverImagePath}
      alt='cover'
      className='h-80 w-full rounded-t-xl object-cover'
    />
  )
}
