import { z } from 'zod'

export const getHistoryDataSchema = z.object({
  interval: z.enum(['month', 'year']),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000).max(2200),
})
