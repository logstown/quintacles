import { mediaTypeArrForLists, mediaTypes } from '@/lib/mediaTypes'
import { Button } from '@nextui-org/button'
import Link from 'next/link'

const CreateCriteriaPage = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-8'>
      <h1 className='mb-8 text-center text-6xl font-semibold'>Create List</h1>
      <div className='flex w-full max-w-screen-md flex-col justify-evenly gap-6 sm:flex-row sm:gap-0'>
        {mediaTypeArrForLists.map(mediaType => (
          <Button
            size='lg'
            key={mediaType.key}
            color='primary'
            variant='ghost'
            className='p-8 text-xl'
            as={Link}
            href={`/create/criteria/${mediaTypes[mediaType.key].urlPlural}`}
            startContent={mediaType.icon}
          >
            {mediaTypes[mediaType.key].plural}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default CreateCriteriaPage
