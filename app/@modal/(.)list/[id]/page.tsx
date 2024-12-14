import { ListDetail } from '@/app/list/_components/ListDetail'

export default async function ListModal(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  return (
    <div className='pt-10'>
      <ListDetail id={Number(id)} />
    </div>
  )
}
