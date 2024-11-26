import { useCallback } from 'react'
import CountUp from 'react-countup'

import { cn } from '@/lib/utils'

export const ToolTipRow = ({
  label,
  textColor,
  bgColor,
  value,
  formatter,
}: {
  label: string
  textColor: string
  bgColor: string
  value: number
  formatter: Intl.NumberFormat
}) => {
  const formattingFn = useCallback(
    (value: number) => {
      return formatter.format(value)
    },
    [formatter],
  )

  return (
    <div className="flex items-center gap-2">
      <div className={cn('h-4 w-4 rounded-full', bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn('text-sm font-bold', textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimal="0"
            formattingFn={formattingFn}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  )
}
