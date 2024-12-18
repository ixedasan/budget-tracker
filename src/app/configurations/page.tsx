import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

import { SIGN_IN_PATH } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Logo from '@/components/common/Logo'
import { CurrencyComboBox } from '@/components/forms/CurrencyComboBox'

const page = async () => {
  const user = await currentUser()
  if (!user) redirect(SIGN_IN_PATH)

  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
      <Logo />
      <div>
        <h1 className="text-center text-3xl">
          Welcome,{' '}
          <span className="font-bold text-primary">{user.fullName}!</span>
        </h1>
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Let&apos;s get started by setting up your currency
        </h2>
        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          You can change these settings at any time
        </h3>
      </div>
      <Separator />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>
            Set your default currency for transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <Separator />
      <Button className="w-full" asChild>
        <Link href={'/'}>I&apos;m done! Take me to the dashboard</Link>
      </Button>
    </div>
  )
}

export default page
