import { redirect } from 'next/navigation'
import { OverviewQuerySchema } from '@/schema/overview'
import { currentUser } from '@clerk/nextjs/server'

import { SIGN_IN_PATH } from '@/lib/constants'
import prisma from '@/lib/db'

export async function GET(req: Request) {
  const user = await currentUser()
  if (!user) redirect(SIGN_IN_PATH)

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const queryParams = OverviewQuerySchema.safeParse({ from, to })
  if (!queryParams.success) {
    return new Response(JSON.stringify(queryParams.error.message), {
      status: 400,
    })
  }

  const stats = await getCategoriesStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  )

  return new Response(JSON.stringify(stats))
}

export type getCategoriesStatsResponseType = Awaited<
  ReturnType<typeof getCategoriesStats>
>

async function getCategoriesStats(userId: string, from: Date, to: Date) {
  const stats = await prisma.transaction.groupBy({
    by: ['type', 'category', 'categoryIcon'],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
  })

  return stats
}
