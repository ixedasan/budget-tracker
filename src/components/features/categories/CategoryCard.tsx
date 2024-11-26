import { Category } from '@prisma/client'
import { TrashIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import DeleteCategoryDialog from './DeleteCategoryDialog'

type Props = {
  category: Category
}

const CategoryCard = ({ category }: Props) => {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="image">
          {category.icon}
        </span>
        <p>{category.name}</p>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className="flex w-full border-separate items-center gap-2 rounded-t-none bg-red-500/10 text-muted-foreground hover:bg-red-500/20"
            variant={'secondary'}
          >
            <TrashIcon size={16} />
            <span>Delete</span>
          </Button>
        }
      />
    </div>
  )
}

export default CategoryCard
