'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import CategoryList from '@/components/features/categories/CategoryList'
import { CurrencyComboBox } from '@/components/forms/CurrencyComboBox'

const page = () => {
  return (
    <>
      <div className="border-b bg-card">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <h3 className="text-3xl font-bold">Manage</h3>
            <p className="text-muted-foreground">
              Manage your accaunt and categories
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto flex flex-col gap-4 py-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>Set your default currency</CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyComboBox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  )
}

export default page
