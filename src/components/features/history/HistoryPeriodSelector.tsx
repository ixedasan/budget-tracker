import { IntervalType, PeriodType } from '@/types'
import { useQuery } from '@tanstack/react-query'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SkeletonWrapper from '@/components/feedback/SkeletonWrapper'
import { getPeriodsResponseType } from '@/app/api/history-periods/route'

import MonthSelector from './MonthSelector'
import YearSelector from './YearSelector'

type Props = {
  interval: IntervalType
  setInterval: (interval: IntervalType) => void
  period: PeriodType
  setPeriod: (period: PeriodType) => void
}

const HistoryPeriodSelector = ({
  interval,
  setInterval,
  period,
  setPeriod,
}: Props) => {
  const historyPeriodsQuery = useQuery<getPeriodsResponseType>({
    queryKey: ['overview', 'history', 'periods'],
    queryFn: () => fetch('/api/history-periods').then(res => res.json()),
  })

  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper
        isLoading={historyPeriodsQuery.isFetching}
        fullWidth={false}
      >
        <Tabs
          value={interval}
          onValueChange={value => setInterval(value as IntervalType)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper
          isLoading={historyPeriodsQuery.isFetching}
          fullWidth={false}
        >
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriodsQuery.data || []}
          />
        </SkeletonWrapper>
        {interval === 'month' && (
          <SkeletonWrapper
            isLoading={historyPeriodsQuery.isFetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  )
}

export default HistoryPeriodSelector
