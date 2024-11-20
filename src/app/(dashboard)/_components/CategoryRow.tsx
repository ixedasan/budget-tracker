import { Category } from '@prisma/client'

type Props = {
  category: Category
}

const CategoryRow = ({ category }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <span role="image">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  )
}

export default CategoryRow
