import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'

import prisma from '@/lib/db'

export async function GET(req: Request) {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const { searchParams } = new URL(req.url)
  const paramType = searchParams.get('type')

  const validation = z.enum(['expense', 'income'])
  const queryParam = validation.safeParse(paramType)

  if (!queryParam.success) {
    return Response.json(queryParam.error, { status: 400 })
  }

  const type = queryParam.data
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
      ...(type && { type }),
    },
    orderBy: {
      name: 'asc',
    },
  })

  return Response.json(categories)
}
