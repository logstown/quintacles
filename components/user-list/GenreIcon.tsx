'use client'

import { getGenreById } from '@/lib/genres'
import { cloneElement, useMemo } from 'react'

export function GenreIcon({ genreId }: { genreId?: number }) {
  const icon = useMemo(() => {
    if (!genreId) return null

    const genre = getGenreById(genreId)
    if (!genre) return null

    return cloneElement(genre.icon, {
      // className: 'h-[1em] w-[1em]',
      // strokeWidth: 1.75,
    })
  }, [genreId])

  return icon
}
