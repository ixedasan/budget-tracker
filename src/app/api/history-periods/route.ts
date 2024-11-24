import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

import prisma from '@/lib/db'

export async function GET(req: Request) {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  try {
    const periods = await getPeriods(user.id)
    return Response.json(periods)
  } catch (error) {
    console.error('Failed to fetch periods:', error)
    return Response.json({ error: 'Failed to fetch periods' }, { status: 500 })
  }
}

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
