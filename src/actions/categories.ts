'use server'

import { redirect } from 'next/navigation'
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategoryShema,
  DeleteCategoryShemaType,
} from '@/schema/categories'
import { currentUser } from '@clerk/nextjs/server'

import prisma from '@/lib/db'

export async function createCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form)
  if (!parsedBody.success) throw new Error('bad request')

  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const { name, icon, type } = parsedBody.data

  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  })
}

export async function deleteCategory(form: DeleteCategoryShemaType) {
  const parsedBody = DeleteCategoryShema.safeParse(form)
  if (!parsedBody.success) throw new Error('bad request')

  const user = await currentUser()
  if (!user) redirect('/sign-in')

  return await prisma.category.delete({
    where: {
      userId_name_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  })
}
