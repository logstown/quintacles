import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className='flex min-h-full justify-center px-4 py-16'>
      <SignIn />
    </div>
  )
}
