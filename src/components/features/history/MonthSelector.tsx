import { useMemo } from 'react'

import { PeriodType } from '@/types/intervalTypes'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = {
  period: PeriodType
  setPeriod: (period: PeriodType) => void
}

const MonthSelector = ({ period, setPeriod }: Props) => {
  const months = useMemo(
    () =>
      Array.from(Array(12).keys()).map(month => ({
        value: month.toString(),
        label: new Date(period.year, month, 1).toLocaleString('default', {
          month: 'long',
        }),
      })),
    [period.year],
  )

  return (
    <Select
      value={period.month.toString()}
      onValueChange={value => {
        const month = parseInt(value, 10)
        if (isNaN(month)) return

        setPeriod({
          month,
          year: period.year,
        })
      }}
    >
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {months.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default MonthSelector
