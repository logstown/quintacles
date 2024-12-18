import { cloneElement } from 'react'
import { getTmdbImageUrl } from '../../lib/random'
import { mediaTypes } from '../../lib/mediaTypes'
import { MediaType } from '@prisma/client'
import { Avatar } from '@nextui-org/avatar'

export function UserListIcon({
  mediaType,
  personPath,
  useMediaIcon,
  useFallback,
  isLarge,
}: {
  mediaType: MediaType
  personPath: string | null
  useMediaIcon?: boolean
  useFallback?: boolean
  isLarge?: boolean
}) {
  const mediaTypeIconBig = cloneElement(mediaTypes[mediaType].icon, {
    size: 28,
    strokeWidth: 1.5,
  })
  const mediaTypeIconSmall = cloneElement(mediaTypes[mediaType].icon, {
    size: 15,
  })

  return (
    <div className='relative'>
      <Avatar
        radius='sm'
        showFallback
        isBordered
        className={isLarge ? 'h-22 w-22 text-large' : ''}
        color='default'
        fallback={useFallback ? mediaTypeIconBig : undefined}
        classNames={{
          img: 'object-[0_-5px]',
        }}
        src={getTmdbImageUrl(personPath, 'w92')}
      />
      {personPath && useMediaIcon && (
        <div className='absolute -right-3 -top-3 rounded-md border-1 border-foreground-200 bg-foreground-200 p-1'>
          {mediaTypeIconSmall}
        </div>
      )}
    </div>
  )
}
