import { useCallback, useState } from 'react'
import { TransactionType } from '@/types'
import { Category } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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

  const succesCallback = useCallback(
    (category: Category) => {
      setValue(category.name)
      setOpen(false)
    },
    [setValue, setOpen],
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
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0">
        <Command onSubmit={e => e.preventDefault()}>
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog type={type} onSuccesCallback={succesCallback} />
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground">
              Tip: You can create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categiriesQuery.data?.map((category: Category) => (
                <CommandItem
                  key={category.name}
                  onSelect={() => {
                    setValue(category.name)
                    setOpen(false)
                  }}
                >
                  <CategoryRow category={category} />
                  <Check
                    className={cn(
                      'h-4 w-4 opacity-0',
                      value === category.name && 'opacity-100',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CategorySelector
