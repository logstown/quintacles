'use client'

import { Button } from '@nextui-org/button'
import { ShuffleIcon } from 'lucide-react'
import { useFormStatus } from 'react-dom'

export function SurpriseMeButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      size='lg'
      isLoading={pending}
      type='submit'
      className='rounded-3xl bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg'
      startContent={!pending && <ShuffleIcon className='ml-2' size={23} />}
    >
      Surprise Me
    </Button>
  )
}
