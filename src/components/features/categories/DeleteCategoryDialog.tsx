'use client'

import { ReactNode } from 'react'
import { deleteCategory } from '@/actions'
import { TransactionType } from '@/types'
import { Category } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type Props = {
  trigger: ReactNode
  category: Category
}

const DeleteCategoryDialog = ({ trigger, category }: Props) => {
  const categoryIdntfy = `${category.name}-${category.type}`

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: async () => {
      toast.success('Category deleted', { id: categoryIdntfy })

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
    },
    onError: () => {
      toast.error('Failed to delete category', { id: categoryIdntfy })
    },
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete the category?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            category.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading('Deleting category...', { id: categoryIdntfy })
              deleteMutation.mutate({
                name: category.name,
                type: category.type as TransactionType,
              })
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCategoryDialog
