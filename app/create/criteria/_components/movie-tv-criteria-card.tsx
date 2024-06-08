'use client'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { ListTitle } from './list-title'
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card'
import { Button } from '@nextui-org/button'
import { mediaTypes } from '@/lib/mediaTypes'
import { useRouter } from 'next/navigation'
import { MediaType } from '@prisma/client'
import { getUserListsUrl } from '@/lib/random'
import { ListTitleBase } from '@/components/list-title-base'
import { RestrictionsUI } from '@/lib/models'
import { MovieTvCriteria } from '@/components/movie-tv-criteria'

export function MovieTvCriteriaCard({ mediaType }: { mediaType: MediaType }) {
  const router = useRouter()
  const [restrictions, setRestrictions] = useState<RestrictionsUI>({ mediaType })

  const goToList = () => {
    const url = getUserListsUrl(restrictions)
    router.push(url)
  }

  return (
    <div className='flex flex-col items-stretch gap-6'>
      <h1 className='ml-6 text-xl sm:text-2xl'>
        What kind of {mediaTypes[mediaType].plural}?
      </h1>
      <Card className='w-fit p-4' shadow='lg'>
        <CardHeader className='border-b-1'>
          <ListTitle mediaType={mediaType}>
            <ListTitleBase restrictions={restrictions} />
          </ListTitle>
        </CardHeader>
        <CardBody className='rounded-xl sm:p-10'>
          <MovieTvCriteria
            restrictions={restrictions}
            onRestrictionsChange={setRestrictions}
          />
        </CardBody>
        <CardFooter className='mt-2 justify-end'>
          <Button
            size='lg'
            color='primary'
            onClick={goToList}
            endContent={<ArrowRight size={20} />}
            variant='shadow'
          >
            Build list
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
