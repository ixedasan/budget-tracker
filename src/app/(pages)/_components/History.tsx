'use client'

import { useMemo, useState } from 'react'
import { getFormatterCurrency } from '@/helpers/get-formatter-currency'
import { IntervalType, PeriodType } from '@/types'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CustomTooltip from '@/components/features/history/CustomTooltip'
import HistoryPeriodSelector from '@/components/features/history/HistoryPeriodSelector'
import SkeletonWrapper from '@/components/feedback/SkeletonWrapper'

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

  const historyDataQuery = useQuery({
    queryKey: ['overview', 'history', interval, period],
    queryFn: () =>
      fetch(
        `/api/history-data?interval=${interval}&year=${period.year}&month=${period.month}`,
      ).then(res => res.json()),
  })

  const dataAvailable =
    historyDataQuery.data && historyDataQuery.data.length > 0

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
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable ? (
              <ResponsiveContainer width={'100%'} height={288}>
                <BarChart
                  height={288}
                  data={historyDataQuery.data}
                  barCategoryGap={5}
                >
                  <defs>
                    <linearGradient id="incomeBar" x1={0} y1={0} x2={0} y2={1}>
                      <stop
                        offset={'0'}
                        stopColor="#22c55e"
                        stopOpacity={'1'}
                      />
                      <stop
                        offset={'1'}
                        stopColor="#22c55e"
                        stopOpacity={'0'}
                      />
                    </linearGradient>

                    <linearGradient id="expenseBar" x1={0} y1={0} x2={0} y2={1}>
                      <stop
                        offset={'0'}
                        stopColor="#ef4444"
                        stopOpacity={'1'}
                      />
                      <stop
                        offset={'1'}
                        stopColor="#ef4444"
                        stopOpacity={'0'}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray={'5 5'}
                    strokeOpacity={'0.2'}
                    vertical={false}
                  />
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={data => {
                      const { year, month, day } = data
                      const date = new Date(year, month, day || 1)
                      if (interval === 'year') {
                        return date.toLocaleDateString('default', {
                          month: 'long',
                        })
                      }
                      return date.toLocaleDateString('default', {
                        day: '2-digit',
                      })
                    }}
                  />
                  <YAxis
                    strokeOpacity="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar
                    dataKey={'income'}
                    label="Income"
                    fill="url(#incomeBar)"
                    radius={4}
                    className="cursor-pointer"
                  />
                  <Bar
                    dataKey={'expense'}
                    label="Expense"
                    fill="url(#expenseBar)"
                    radius={4}
                    className="cursor-pointer"
                  />

                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={props => (
                      <CustomTooltip formatter={formatter} {...props} />
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Card className="flex h-72 flex-col items-center justify-center bg-background">
                <p>No data for the selected period</p>
                <span className="text-sm text-muted-foreground">
                  Try to select a diferent perriod or add some transactions
                </span>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  )
}

export default History
