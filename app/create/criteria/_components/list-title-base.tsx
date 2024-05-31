import { mediaTypes } from '@/lib/mediaTypes'
import { MediaType } from '@prisma/client'
import { cloneElement } from 'react'

export function ListTitle({
  children,
  mediaType,
}: {
  children: React.ReactNode
  mediaType: MediaType
}) {
  const mediaTypeIcon = cloneElement(mediaTypes[mediaType].icon, {
    size: 35,
    strokeWidth: 1.5,
  })
  return (
    <div className='flex gap-3'>
      <div className='text-neutral-400'>{mediaTypeIcon}</div>
      <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>
        {children}
      </h1>
    </div>
  )
}
