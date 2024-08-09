'use client'

import { useUserListLink } from '@/lib/hooks'
import { RestrictionsUI } from '@/lib/models'
import Link from 'next/link'
import { ReactNode } from 'react'

export function UserListLink({
  children,
  listId,
  restrictions,
  usernames,
  isHardReload,
}: {
  children: ReactNode
  listId: number
  restrictions: RestrictionsUI
  usernames: string[]
  isHardReload?: boolean
}) {
  const href = useUserListLink(restrictions, usernames, listId)

  //TODO: Hard reload kinda sucks
  return isHardReload ? (
    <div className='cursor-pointer' onClick={() => location.assign(href)}>
      {children}
    </div>
  ) : (
    <Link href={href} color='foreground'>
      {children}
    </Link>
  )
}
