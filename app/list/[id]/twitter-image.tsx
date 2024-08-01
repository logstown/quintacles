import { ListOgImage } from '../_components/ListOgImage'

// export const runtime = 'edge'

export const alt = 'List'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params: { id } }: { params: { id: string } }) {
  return ListOgImage({ id: Number(id) }, size)
}
