import { TransactionType } from '@/types'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getCategoriesStatsResponseType } from '@/app/api/stats/categories/route'

type Props = {
  formatter: Intl.NumberFormat
  type: TransactionType
  data: getCategoriesStatsResponseType
}

const CategoriesStatsItem = ({ formatter, type, data }: Props) => {
  const filteredData = data.filter(item => item.type === type)
  const total = filteredData.reduce(
    (acc, item) => acc + (item._sum?.amount || 0),
    0,
  )

  return (
    <Card className="col-span-6 h-80 w-full">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
          <span className="first-letter:uppercase">{type}s by category</span>
        </CardTitle>
      </CardHeader>
      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            <p>No data for the selected period</p>
            <span className="text-sm text-muted-foreground">
              Try to select a diferent perriod or add some transactions
            </span>
          </div>
        )}
        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4">
            <div className="flex w-full flex-col gap-4 p-4">
              {filteredData.map(item => {
                const amount = item._sum?.amount || 0
                const percent = (amount / total) * 100

                return (
                  <div className="flex flex-col gap-2" key={item.category}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-gray-400">
                        {item.categoryIcon} {item.category}{' '}
                        <span className="ml-2 to-muted-foreground text-xs">
                          ({percent.toFixed(0)}%)
                        </span>
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percent}
                      indicator={
                        type === 'income' ? 'bg-green-500' : 'bg-red-500'
                      }
                    />
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  )
}

export default CategoriesStatsItem
