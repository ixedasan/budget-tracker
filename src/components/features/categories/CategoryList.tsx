import { TransactionType } from '@/types'
import { Category } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { PlusSquareIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import SkeletonWrapper from '@/components/feedback/SkeletonWrapper'

import CategoryCard from './CategoryCard'
import CreateCategoryDialog from './CreateCategoryDialog'

type Props = {
  type: TransactionType
}

const CategoryList = ({ type }: Props) => {
  const categoriesQuery = useQuery({
    queryKey: ['categories', type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then(res => res.json()),
  })

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isFetching}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === 'expense' ? (
                <TrendingDownIcon className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
              ) : (
                <TrendingUpIcon className="h-12 w-12 items-center rounded-lg bg-green-400/10 p-2 text-green-500" />
              )}
              <div>
                {type === 'expense' ? 'Expense' : 'Income'} categories
                <p className="text-sm text-muted-foreground">sorted by name</p>
              </div>
            </div>

            <CreateCategoryDialog
              type={type}
              onSuccesCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquareIcon size={16} />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />
        {!dataAvailable && (
          <div className="flex h-40 w-full items-center justify-center">
            <p>
              No
              <span
                className={cn(
                  'm-1',
                  type === 'income'
                    ? 'text-green-500'
                    : type === 'expense' && 'text-red-500',
                )}
              ></span>
              categories found
            </p>
            <p className="text-sm text-muted-foreground">
              Please create a new category to get started.
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 px-6 sm:grid-flow-col sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  )
}

export default CategoryList
