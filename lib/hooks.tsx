import { MediaType } from '@prisma/client'
import { useEffect, useMemo, useState } from 'react'
import { getGenres } from './genres'
import { RestrictionsUI } from './models'
import { getSlug, getUserListsUrl } from './random'
import { useUser } from '@clerk/nextjs'

export const useGenres = (mediaType: MediaType) => {
  return useMemo(() => {
    return mediaType ? getGenres(mediaType) : []
  }, [mediaType])
}

export function useDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay], // Only re-call effect if value or delay changes
  )

  return debouncedValue
}

export const useScrollAfter5Items = (itemsLength?: number) => {
  useEffect(() => {
    if (itemsLength === 5) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [itemsLength])
}

export const useUserListUrl = (restrictions: RestrictionsUI) => {
  return useMemo(() => getUserListsUrl(restrictions), [restrictions])
}

export const useUserListLink = (
  restrictions: RestrictionsUI,
  usernames: string[],
  listId: number,
) => {
  const { user } = useUser()
  const slug = useMemo(() => getSlug(restrictions), [restrictions])

  let username: string | undefined

  if (user && usernames.includes(user.username ?? '')) {
    username = user.username ?? ''
  } else if (usernames.length == 1) {
    username = usernames[0]
  }

  return username ? `/user/${username}/list/${slug}` : `/list/${listId}`
}
