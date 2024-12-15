import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

import { SIGN_IN_PATH } from '@/lib/constants'
import prisma from '@/lib/db'

export async function GET() {
  const user = await currentUser()
  if (!user) redirect(SIGN_IN_PATH)

  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  })

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: 'USD',
      },
    })
  }

  revalidatePath('/')
  return Response.json(userSettings)
}
