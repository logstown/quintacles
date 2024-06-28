import Image from 'next/image'
import React from 'react'

const CreditsPage: React.FC = () => {
  return (
    <div className='container mx-auto max-w-screen-xl'>
      <h1 className='mb-4 text-3xl font-bold'>Credits</h1>
      <ul className='mt-16 text-xl'>
        <li className='flex items-center gap-8'>
          <Image src='/tmdb-logo.svg' height={100} width={100} alt='tmdb logo' />
          The Movie Database (TMDb) API was used to fetch movie and TV show data.
        </li>
      </ul>
      <p className='text-lg'></p>
    </div>
  )
}

export default CreditsPage
