import { mediaTypeArrForLists, mediaTypes } from '@/lib/mediaTypes'
import { Button } from '@nextui-org/button'
import Link from 'next/link'
import { cloneElement } from 'react'

const CreateCriteriaPage = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-20'>
      <h1 className='text-center text-5xl font-semibold drop-shadow-2xl sm:text-7xl'>
        Create List
      </h1>
      <div className='flex w-full max-w-screen-lg flex-col justify-evenly gap-6 sm:flex-row sm:gap-0'>
        {mediaTypeArrForLists.map(mediaType => {
          const icon = cloneElement(mediaType.icon, { size: 30 })
          return (
            <Button
              size='lg'
              key={mediaType.key}
              color='primary'
              variant='ghost'
              className='p-8 text-2xl'
              as={Link}
              href={`/create/criteria/${mediaTypes[mediaType.key].urlPlural}`}
              startContent={icon}
            >
              {mediaTypes[mediaType.key].plural}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default CreateCriteriaPage
