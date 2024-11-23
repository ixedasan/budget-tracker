import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

import prisma from '@/lib/db'
import { Button } from '@/components/ui/button'

import CreateTransactionDialog from './_components/CreateTransactionDialog'
import Overview from './_components/Overview'

const page = async () => {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  })
  if (!userSettings) redirect('/configurations')

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="flex flex-wrap items-center justify-between gap-6 px-6 py-8">
          <h1 className="text-2xl font-bold">Hello. {user.fullName}!</h1>
          <div className="flex items-center gap-4">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className="border-green-500 bg-green-950 text-white hover:bg-green-700 hover:text-white"
                >
                  New income
                </Button>
              }
              type="income"
            />

            <CreateTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className="border-red-500 bg-red-950 text-white hover:bg-red-700 hover:text-white"
                >
                  New expense
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
    </div>
  )
}

export default page
