import { ListDetail } from '@/app/list/_components/ListDetail'

export default async function ListModal(props: {
  params: Promise<{ username: string; slug: string }>
}) {
  const params = await props.params

  const { username, slug } = params

  return (
    <div className='pt-20'>
      <ListDetail username={username} slug={slug} isModal />
    </div>
  )
}
