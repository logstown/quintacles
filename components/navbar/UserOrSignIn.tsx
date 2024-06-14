'use client'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function UserOrSignIn() {
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton appearance={{ elements: { avatarBox: 'h-10 w-10' } }} />
      </SignedIn>
    </>
  )
}
