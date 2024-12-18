'use server'

import { redirect } from 'next/navigation'
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from '@/schema/transaction'
import { currentUser } from '@clerk/nextjs/server'

import { SIGN_IN_PATH } from '@/lib/constants'
import prisma from '@/lib/db'

export async function createTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form)
  if (!parsedBody.success) {
    throw new Error('Invalid form data')
  }

  const user = await currentUser()
  if (!user) redirect(SIGN_IN_PATH)

  const { amount, category, date, description, type } = parsedBody.data
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  })

  if (!categoryRow) {
    throw new Error('Category not found')
  }

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description ?? '',
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon ?? '',
      },
    }),

    prisma.monthlyHistory.upsert({
      where: {
        userId_day_month_year: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),

    prisma.yearlyHistory.upsert({
      where: {
        userId_month_year: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),
  ])
}

export async function deleteTransaction(id: string) {
  const user = await currentUser()
  if (!user) redirect(SIGN_IN_PATH)

  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  })

  if (!transaction) {
    throw new Error('bad request')
  }

  await prisma.$transaction([
    prisma.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    }),

    prisma.monthlyHistory.update({
      where: {
        userId_day_month_year: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === 'expense'
          ? {
              expense: {
                decrement: transaction.amount,
              },
            }
          : {
              income: {
                decrement: transaction.amount,
              },
            }),
      },
    }),

    prisma.yearlyHistory.update({
      where: {
        userId_month_year: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === 'expense'
          ? {
              expense: {
                decrement: transaction.amount,
              },
            }
          : {
              income: {
                decrement: transaction.amount,
              },
            }),
      },
    }),
  ])
}
