import { mediaTypeArrForLists, mediaTypes } from '@/lib/mediaTypes'
import { Button } from '@nextui-org/button'
import Link from 'next/link'

const CreateCriteriaPage = () => {
  return (
    <div className='flex h-full flex-col items-center justify-center gap-8'>
      <h1 className='mb-8 text-center text-4xl font-bold'>Create a List</h1>
      <div className='flex w-full max-w-screen-md flex-col justify-evenly gap-6 sm:flex-row sm:gap-0'>
        {mediaTypeArrForLists.map(mediaType => (
          <Button
            size='lg'
            color='primary'
            variant='shadow'
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
