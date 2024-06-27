'use client'

import { Button } from '@nextui-org/button'
import { ShuffleIcon } from 'lucide-react'
import { useFormStatus } from 'react-dom'

export function RandomListButton() {
  const { pending } = useFormStatus()

  return (
    <>
      <Button
        type='submit'
        variant='bordered'
        className='hidden md:flex'
        isLoading={pending}
        startContent={!pending && <ShuffleIcon size={15} />}
      >
        Random
      </Button>
      <Button
        type='submit'
        variant='bordered'
        isIconOnly
        size='sm'
        className='md:hidden'
        isLoading={pending}
      >
        {!pending && <ShuffleIcon size={15} />}
      </Button>
    </>
  )
}
