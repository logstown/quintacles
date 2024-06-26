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
}: {
  children: ReactNode
  listId: number
  restrictions: RestrictionsUI
  usernames: string[]
}) {
  const href = useUserListLink(restrictions, usernames, listId)

  return (
    <Link href={href} color='foreground'>
      {children}
    </Link>
  )
}
