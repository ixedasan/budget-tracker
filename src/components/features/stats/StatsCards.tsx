import { useMemo } from 'react'
import { dateToUTC } from '@/helpers/date-to-utc'
import { getFormatterCurrency } from '@/helpers/get-formatter-currency'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'

import SkeletonWrapper from '@/components/feedback/SkeletonWrapper'
import { getBalanceResponseType } from '@/app/api/stats/balance/route'

import StatsItem from './StatsItem'

type Props = {
  userSettings: UserSettings
  from: Date
  to: Date
}

const StatsCards = ({ userSettings, from, to }: Props) => {
  const statsQuery = useQuery<getBalanceResponseType>({
    queryKey: ['overview', 'stats', from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${dateToUTC(from)}&to=${dateToUTC(to)}`,
      ).then(res => res.json()),
  })

  const formatter = useMemo(() => {
    return getFormatterCurrency(userSettings.currency)
  }, [userSettings.currency])

  const income = statsQuery.data?.income || 0
  const expense = statsQuery.data?.expense || 0

  const balance = income - expense

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsItem
          formatter={formatter}
          title="Income"
          value={income}
          icon={
            <TrendingUpIcon className="h-12 w-12 items-center rounded-lg bg-green-400/10 p-2 text-green-500" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsItem
          formatter={formatter}
          title="Expense"
          value={expense}
          icon={
            <TrendingDownIcon className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatsItem
          formatter={formatter}
          title="Balance"
          value={balance}
          icon={
            <PiggyBankIcon className="h-12 w-12 items-center rounded-lg bg-orange-400/10 p-2 text-orange-500" />
          }
        />
      </SkeletonWrapper>
    </div>
  )
}

export default StatsCards
