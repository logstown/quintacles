import { Metadata } from 'next'
import Image from 'next/image'
import React from 'react'

export const metadata: Metadata = {
  title: 'Credits',
}

const CreditsPage: React.FC = () => {
  return (
    <div className='container mx-auto max-w-screen-md'>
      <h1 className='mb-4 text-3xl font-bold'>Credits</h1>
      <ul className='mt-16 sm:text-xl'>
        <li className='flex items-center gap-8'>
          <Image
            src='/tmdb-logo.svg'
            height={100}
            width={100}
            alt='tmdb logo'
            unoptimized
          />
          This website uses the The Movie Database (TMDB) API but is not endorsed or
          certified by TMDB.
        </li>
      </ul>
      <p className='text-lg'></p>
    </div>
  )
}

export default CreditsPage
