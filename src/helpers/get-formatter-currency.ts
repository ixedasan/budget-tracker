import { currencies } from '@/lib/currencies'

export function getFormatterCurrency(currency: string) {
  const locale = currencies.find(c => c.value === currency)?.locale

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  })
}
