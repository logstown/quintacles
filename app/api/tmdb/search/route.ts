import { searchMedia } from '@/lib/TmdbService'
import { MediaType } from '@prisma/client'

export async function GET(request: Request, { params }: { params: any }) {
  const { searchParams } = new URL(request.url)
  const mediaType = searchParams.get('mediaType')
  const query = searchParams.get('query')

  if (!mediaType || !query) {
    return Response.json({ data: { results: [] } })
  }

  const data = await searchMedia(mediaType as MediaType, query)

  return Response.json({ data })
}
