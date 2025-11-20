'use client'

import { SignInButton, SignOutButton, SignUpButton, useUser } from '@clerk/nextjs'
import { Avatar } from '@heroui/avatar'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from '@heroui/dropdown'
import { ListIcon, LogOutIcon, PlusIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

export function UserOrSignIn() {
  const { user, isSignedIn } = useUser()

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Avatar
          isBordered
          as='button'
          className='transition-transform'
          color='primary'
          name={user?.fullName ?? user?.username ?? ''}
          src={user?.imageUrl}
        />
      </DropdownTrigger>
      {isSignedIn ? (
        <DropdownMenu aria-label='Profile Actions' variant='shadow'>
          <DropdownSection showDivider>
            <DropdownItem
              key='your-lists'
              color='primary'
              className='h-14'
              as={Link}
              startContent={<ListIcon size={22} className='mr-1' />}
              href={`/user/${user.username}`}
            >
              <span className='text-base'>My Lists</span>
            </DropdownItem>
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              key='profile'
              className='h-14 items-start gap-2'
              description={`Signed in as @${user.username}`}
              as={Link}
              href='/user-profile'
            >
              Account
            </DropdownItem>
            <DropdownItem
              key='logout'
              color='danger'
              startContent={<LogOutIcon size={20} className='mr-1' />}
            >
              <SignOutButton>
                <button className='w-full text-left'>Sign Out</button>
              </SignOutButton>
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownItem key='sign_in' color='primary'>
            <SignInButton>
              <button className='w-full text-left'>Sign In</button>
            </SignInButton>
          </DropdownItem>
          <DropdownItem key='sign_up'>
            <SignUpButton>
              <button className='w-full text-left'>Sign Up</button>
            </SignUpButton>
          </DropdownItem>
        </DropdownMenu>
      )}
    </Dropdown>
  )
}
