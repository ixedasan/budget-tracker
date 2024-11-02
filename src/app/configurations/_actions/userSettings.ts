'use server'

import { redirect } from 'next/navigation'
import { UpdateUserCurrencySchema } from '@/schema/userSettings'
import { currentUser } from '@clerk/nextjs/server'

import prisma from '@/lib/db'

export async function UpdateUserCurrency(currency: string) {
  const parsedBuddy = UpdateUserCurrencySchema.safeParse({ currency })

  if (!parsedBuddy.success) {
    throw new Error(parsedBuddy.error.errors[0].message)
  }

  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const userSettings = await prisma.userSettings.update({
    where: {
      userId: user.id,
    },
		data: {
			currency,
		},
  })

	return userSettings
}
