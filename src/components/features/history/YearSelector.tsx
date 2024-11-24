import { PeriodType } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getPeriodsResponseType } from '@/app/api/history-periods/route'

type Props = {
  period: PeriodType
  setPeriod: (period: PeriodType) => void
  years: getPeriodsResponseType
}

const YearSelector = ({ period, setPeriod, years }: Props) => {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={value =>
        setPeriod({
          month: period.month,
          year: parseInt(value),
        })
      }
    >
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map(year => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default YearSelector
