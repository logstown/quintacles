import { ListDetail } from '../_components/ListDetail'

export default async function ListPage({
  params: { id },
}: {
  params: { id: string }
}) {
  return <ListDetail id={Number(id)} />
}
