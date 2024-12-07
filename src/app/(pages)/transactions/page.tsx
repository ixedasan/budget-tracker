'use client'

import { useState } from 'react'
import { differenceInDays, startOfMonth } from 'date-fns'
import { toast } from 'sonner'

import { MAX_DATE_RANGE_DAYS } from '@/lib/constants'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import TransactionTable from '@/components/features/transactions/TransactionTable'

const TransactionsPage = () => {
  const [range, setRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  })

  return (
    <>
      <div className="border-b bg-card">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 py-6">
          <div>
            <h3 className="text-3xl font-bold">Transactions history</h3>
          </div>
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
      <div className="container mx-auto">
        <TransactionTable from={range.from} to={range.to} />
      </div>
    </>
  )
}

export default TransactionsPage
