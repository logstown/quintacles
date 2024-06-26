import { ListDetail } from '@/app/list/_components/ListDetail'

export default async function ListPage({
  params: { username, slug },
}: {
  params: { username: string; slug: string }
}) {
  return <ListDetail username={username} slug={slug} />
}
