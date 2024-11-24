import { useMemo } from 'react'
import { dateToUTC } from '@/helpers/date-to-utc'
import { getFormatterCurrency } from '@/helpers/get-formatter-currency'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

import SkeletonWrapper from '@/components/feedback/SkeletonWrapper'
import { getCategoriesStatsResponseType } from '@/app/api/stats/categories/route'

import CategoriesStatsItem from './CategoriesStatsItem'

type Props = {
  userSettings: UserSettings
  from: Date
  to: Date
}

const CategoriesStats = ({ userSettings, from, to }: Props) => {
  const statsQuery = useQuery<getCategoriesStatsResponseType>({
    queryKey: ['overview', 'stats', 'categories', from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${dateToUTC(from)}&to=${dateToUTC(to)}`,
      ).then(res => res.json()),
  })

  const formatter = useMemo(() => {
    return getFormatterCurrency(userSettings.currency)
  }, [userSettings.currency])

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesStatsItem
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesStatsItem
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  )
}

export default CategoriesStats
