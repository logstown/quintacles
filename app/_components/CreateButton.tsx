import { auth } from '@clerk/nextjs/server'
import { Button } from "@heroui/button"
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

export async function CreateButton({ isLoading }: { isLoading?: boolean }) {
  let authUI

  if (!isLoading) {
    authUI = await auth()
  }

  return (
    <Button
      className='bg-linear-to-tr from-primary-600 via-primary-500 to-secondary-400 text-white shadow-2xl md:rounded-3xl md:p-10 md:text-2xl'
      size='lg'
      as={Link}
      isLoading={isLoading}
      prefetch={!!authUI?.userId}
      href='/create/criteria'
      startContent={<PlusIcon />}
    >
      Create List
    </Button>
  )
}
