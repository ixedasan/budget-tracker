'use client'

import { useCallback, useState } from 'react'
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/schema/categories'
import { TransactionType } from '@/types'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleOff, Loader, PlusSquareIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { createCategory } from '../_actions/categories'
import { useTheme } from "next-themes"

type Props = {
  type: TransactionType
  onSuccesCallback: (category: Category) => void
}

const CreateCategoryDialog = ({ type, onSuccesCallback }: Props) => {
  const [open, setOpen] = useState(false)

  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      type,
    },
  })

  const queryClient = useQueryClient() 

  const { mutate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: '',
        icon: '',
        type,
      })
      toast.success(`Category ${data.name} created successfully`, {
        id: 'create-category',
      })

      onSuccesCallback(data)

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      })

      setOpen(prev => !prev)
    },
    onError: () => {
      toast.error('Something went wrong', {
        id: 'create-category',
      })
    },
  })

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading('Creating category...', {
        id: 'create-category',
      })
      mutate(values)
    },
    [mutate],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          className="flex border-separate items-center justify-start rounded-none p-3 text-muted-foreground"
        >
          <PlusSquareIcon className="mr-2" size={16} /> Create new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create
            <span
              className={cn(
                type === 'income'
                  ? 'text-green-500'
                  : type === 'expense' && 'text-red-500',
                'm-1',
              )}
            >
              {type}
            </span>
            category
          </DialogTitle>
          <DialogDescription>
            Categories help you organize your transactions. You can create a new
            category for each type of transaction.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of the category.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={'outline'} className="h-24 w-full">
                          {form.watch('icon') ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff
                                style={{ width: '48px', height: '48px' }}
                              />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how the category will be displayed in the
                    application.
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={'secondary'}
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? <Loader className="animate-spin" /> : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCategoryDialog
