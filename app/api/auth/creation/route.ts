import prisma from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await currentUser()

  if (!user || user === null || !user.id) {
    throw new Error('No User for some reason!')
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        createdAt: new Date(user.createdAt),
        username: user.username!,
        displayName: user.fullName,
        photoURL: user.imageUrl,
      },
    })
  }

  return NextResponse.redirect('http://localhost:3000')
}
