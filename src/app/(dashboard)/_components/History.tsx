'use client'

import { useMemo, useState } from 'react'
import { getFormatterCurrency } from '@/helpers/get-formatter-currency'
import { UserSettings } from '@prisma/client'

import { IntervalType, PeriodType } from '@/types/intervalTypes'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import HistoryPeriodSelector from "@/components/features/history/HistoryPeriodSelector"

type Props = {
  userSettings: UserSettings
}

const History = ({ userSettings }: Props) => {
  const [interval, setInterval] = useState<IntervalType>('month')
  const [period, setPeriod] = useState<PeriodType>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  })

  const formatter = useMemo(() => {
    return getFormatterCurrency(userSettings.currency)
  }, [userSettings.currency])

  return (
    <div className="container mx-auto">
      <h2 className="mt-12 text-3xl font-bold">History</h2>
      <Card className="col-span-12 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector
              interval={interval}
              setInterval={setInterval}
              period={period}
              setPeriod={setPeriod}
            />

            <div className="flex h-10 gap-2">
              <Badge
                variant={'outline'}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                Income
              </Badge>
              <Badge
                variant={'outline'}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}

export default History
