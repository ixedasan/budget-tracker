import { useState } from 'react'
import { TransactionType } from '@/types'
import { Category } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Command, CommandInput } from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import CategoryRow from './CategoryRow'
import CreateCategoryDialog from './CreateCategoryDialog'

type Props = {
  type: TransactionType
}

const CategorySelector = ({ type }: Props) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const categiriesQuery = useQuery({
    queryKey: ['categories', { type }],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then(res => res.json()),
  })

  const selectedCategory = categiriesQuery.data?.find(
    (category: Category) => category.name === value,
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          role="combobox"
          aria-expanded={open}
          className="w-52 justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            'Select category'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command onSubmit={e => e.preventDefault()}>
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog type={type} />
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CategorySelector
