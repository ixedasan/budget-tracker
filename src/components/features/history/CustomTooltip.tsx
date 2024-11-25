import { HistoryData } from '@/types'

import { ToolTipRow } from './TolTipRow'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, formatter }: any) => {
  if (!active || !payload || payload.length === 0) return null

  const data: HistoryData = payload[0].payload
  const { expense, income } = data

  return (
    <div className="min-w-72 rounded border bg-background p-4">
      <ToolTipRow
        formatter={formatter}
        label="Expense"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />
      <ToolTipRow
        formatter={formatter}
        label="Income"
        value={income}
        bgColor="bg-green-500"
        textColor="text-green-500"
      />
      <ToolTipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor="bg-gray-500"
        textColor="text-foreground"
      />
    </div>
  )
}

export default CustomTooltip
