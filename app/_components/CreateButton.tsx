import { auth } from '@clerk/nextjs/server'
import { Button } from '@heroui/button'
import { PlusIcon } from 'lucide-react'
import { Link } from '@heroui/link'

export async function CreateButton({ isLoading }: { isLoading?: boolean }) {
  let authUI

  if (!isLoading) {
    authUI = await auth()
  }

  return (
    <Button
      className='from-primary-600 via-primary-500 to-secondary-400 bg-linear-to-tr text-white shadow-2xl md:rounded-3xl md:p-10 md:text-2xl'
      size='lg'
      isLoading={isLoading}
      as={Link}
      href='/create/criteria'
      startContent={<PlusIcon />}
    >
      Create List
    </Button>
  )
}
