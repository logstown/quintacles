import { ListOgImage } from '@/app/list/_components/ListOgImage'

// export const runtime = 'edge'

export const alt = 'List'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: { username: string; slug: string }
}) {
  return ListOgImage(params, size)
}
