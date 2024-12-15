import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

import { SIGN_IN_PATH } from '@/lib/constants'
import prisma from '@/lib/db'

export async function GET() {
  const user = await currentUser()
  if (!user) redirect(SIGN_IN_PATH)

  try {
    const periods = await getPeriods(user.id)
    return Response.json(periods)
  } catch (error) {
    console.error('Failed to fetch periods:', error)
    return Response.json({ error: 'Failed to fetch periods' }, { status: 500 })
  }
}

export type getPeriodsResponseType = Awaited<ReturnType<typeof getPeriods>>

async function getPeriods(userId: string) {
  const DEFAULT_YEAR = new Date().getFullYear()

  try {
    const result = await prisma.monthlyHistory.findMany({
      where: { userId },
      select: { year: true },
      distinct: ['year'],
      orderBy: { year: 'asc' },
    })

    const years = result.map(r => r.year)
    return years.length ? years : [DEFAULT_YEAR]
  } catch (error) {
    console.error('Database query failed:', error)
    throw error
  }
}
