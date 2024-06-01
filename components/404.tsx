import { Button } from '@nextui-org/button'
import Link from 'next/link'
import React from 'react'

const NotFoundPage: React.FC = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-100'>
      <h1 className='text-4xl font-bold text-gray-800'>404</h1>
      <p className='text-lg text-gray-600'>Oops! Page not found.</p>
      <Button
        as={Link}
        size='lg'
        href='/'
        color='primary'
        variant='shadow'
        className='mt-4'
      >
        Go back to Home
      </Button>
    </div>
  )
}

export default NotFoundPage
