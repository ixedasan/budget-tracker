import { ReactNode, useCallback } from 'react'
import CountUp from 'react-countup'

import { Card } from '@/components/ui/card'

type Props = {
  formatter: Intl.NumberFormat
  title: string
  value: number
  icon: ReactNode
}

const StatsItem = ({ formatter, title, value, icon }: Props) => {
  const format = useCallback(
    (value: number) => {
      return formatter.format(value)
    },
    [formatter],
  )

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          className="text-2xl"
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={format}
        />
      </div>
    </Card>
  )
}

export default StatsItem
