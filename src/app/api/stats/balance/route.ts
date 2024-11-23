import { redirect } from 'next/navigation'
import { OverviewQuerySchema } from '@/schema/overview'
import { currentUser } from '@clerk/nextjs/server'

import prisma from '@/lib/db'

export async function GET(req: Request) {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const queryParams = OverviewQuerySchema.safeParse({ from, to })
  if (!queryParams.success) {
    return new Response(JSON.stringify(queryParams.error.message), {
      status: 400,
    })
  }

  const balance = await getBalance(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  )

  return new Response(JSON.stringify(balance))
}

export type getBalanceResponseType = Awaited<ReturnType<typeof getBalance>>

async function getBalance(userId: string, from: Date, to: Date) {
  const totals = await prisma.transaction.groupBy({
    by: ['type'],
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
  })

  return {
    expense: totals.find(t => t.type === 'expense')?._sum.amount || 0,
    income: totals.find(t => t.type === 'income')?._sum.amount || 0,
  }
}
