import { CircularProgress } from '@nextui-org/progress'
import { Select, SelectItem } from '@nextui-org/select'
import { Skeleton } from '@nextui-org/skeleton'

export default function Loading() {
  return (
    <div className='flex justify-center py-5'>
      <CircularProgress aria-label='loading' />
    </div>
  )
}
