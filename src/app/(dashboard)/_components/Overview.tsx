'use client'

import { useState } from 'react'
import { UserSettings } from '@prisma/client'
import { differenceInDays, startOfMonth } from 'date-fns'
import { toast } from 'sonner'

import { MAX_DATE_RANGE_DAYS } from '@/lib/constants'
import { DateRangePicker } from '@/components/ui/date-range-picker'

type Props = {
  userSettings: UserSettings
}

const Overview = ({ userSettings }: Props) => {
  const [range, setRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  })

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 p-6 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
          <DateRangePicker
            initialDateFrom={range.from}
            initialDateTo={range.to}
            showCompare={false}
            onUpdate={values => {
              const { from, to } = values.range
              if (!from || !to) return
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `Date range cannot exceed ${MAX_DATE_RANGE_DAYS} days`,
                )
                return
              }
              setRange({ from, to })
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Overview
