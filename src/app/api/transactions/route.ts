import { redirect } from 'next/navigation'
import { getFormatterCurrency } from '@/helpers/get-formatter-currency'
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

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  })

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 })
  }

  const transactions = await getTransactions(
    user.id,
    queryParams.data.from,
    queryParams.data.to,
  )

  return Response.json(transactions)
}

export type getTransactionsResponseType = Awaited<
  ReturnType<typeof getTransactions>
>

async function getTransactions(userId: string, from: Date, to: Date) {
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  })

  if (!userSettings) {
    throw new Error('User settings not found')
  }

  const formatter = getFormatterCurrency(userSettings.currency)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: 'desc',
    },
  })

  return transactions.map(transaction => ({
    ...transaction,
    formattedAmount: formatter.format(transaction.amount),
  }))
}
