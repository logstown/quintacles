import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className='flex min-h-full justify-center px-4 py-16'>
      <SignUp />
    </div>
  )
}
