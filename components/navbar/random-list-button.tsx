'use client'

import { Button } from '@nextui-org/button'
import { ShuffleIcon } from 'lucide-react'
import { useFormStatus } from 'react-dom'

export function RandomListButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type='submit'
      variant='bordered'
      isLoading={pending}
      startContent={!pending && <ShuffleIcon size={15} />}
    >
      Random
    </Button>
  )
}
