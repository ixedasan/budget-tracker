import { z } from 'zod'

import { currencies } from '@/lib/currencies'

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom(value => {
    const found = currencies.some(currency => currency.value === value)
    if (!found) throw new Error(`Invalid currency: ${value}`)

		return value
  }),
})
