import { ListDetail } from '@/app/list/_components/ListDetail'

export default function ListModal({ params: { id } }: { params: { id: string } }) {
  return (
    <div className='px-6 pb-6 pt-10'>
      <ListDetail id={id} />
    </div>
  )
}
