import { UserProfile } from '@clerk/nextjs'

const UserProfilePage = () => (
  <div className='flex justify-center'>
    <UserProfile path='/user-profile' />
  </div>
)

export default UserProfilePage
