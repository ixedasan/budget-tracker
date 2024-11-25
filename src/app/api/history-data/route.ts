import { redirect } from 'next/navigation'
import { getHistoryDataSchema } from '@/schema/history'
import { HistoryData, IntervalType, PeriodType } from '@/types'
import { currentUser } from '@clerk/nextjs/server'
import { getDaysInMonth } from 'date-fns'

import prisma from '@/lib/db'

export async function GET(req: Request) {
  const user = await currentUser()
  if (!user) redirect('sign-in')

  const { searchParams } = new URL(req.url)

  const interval = searchParams.get('interval')
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  const queryParams = getHistoryDataSchema.safeParse({
    interval,
    year,
    month,
  })

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 })
  }

  const data = await getHistoryData(user.id, queryParams.data.interval, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  })

  return Response.json(data)
}

export type getHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>

async function getHistoryData(
  userId: string,
  interval: IntervalType,
  period: PeriodType,
) {
  switch (interval) {
    case 'year':
      return await getYearData(userId, period.year)
    case 'month':
      return await getMonthData(userId, period.year, period.month)
  }
}

async function getYearData(userId: string, year: number) {
  const result = await prisma.yearlyHistory.groupBy({
    by: ['month'],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      month: 'asc',
    },
  })

  if (!result || result.length === 0) return []

  const histoty: HistoryData[] = []

  for (let i = 0; i < 12; i++) {
    let expense = 0
    let income = 0

    const month = result.find(r => r.month === i)
    if (month) {
      expense = month._sum.expense || 0
      income = month._sum.income || 0
    }

    histoty.push({ year, month: i, expense, income })
  }

  return histoty
}

async function getMonthData(userId: string, year: number, month: number) {
  const result = await prisma.monthlyHistory.groupBy({
    by: ['day'],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: {
      day: 'asc',
    },
  })

  if (!result || result.length === 0) return []

  const histoty: HistoryData[] = []
  const daysInMonth = getDaysInMonth(new Date(year, month))

  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0
    let income = 0

    const day = result.find(r => r.day === i)
    if (day) {
      expense = day._sum.expense || 0
      income = day._sum.income || 0
    }

    histoty.push({ year, month, day: i, expense, income })
  }

  return histoty
}
