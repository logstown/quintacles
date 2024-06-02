'use client'

import { Button } from '@nextui-org/button'
import { ShuffleIcon } from 'lucide-react'
import { useFormStatus } from 'react-dom'

export function RandomListButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      size='sm'
      isLoading={pending}
      className='rounded-3xl bg-gradient-to-tr from-primary-500 to-secondary-500 text-white shadow-lg'
      startContent={!pending && <ShuffleIcon className='ml-2' size={20} />}
    >
      Random List
    </Button>
  )
}
