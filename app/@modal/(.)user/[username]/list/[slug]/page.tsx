import { ListDetail } from '@/app/list/_components/ListDetail'

export default async function ListModal({
  params: { username, slug },
}: {
  params: { username: string; slug: string }
}) {
  return (
    <div className='pt-10'>
      <ListDetail username={username} slug={slug} />
    </div>
  )
}
