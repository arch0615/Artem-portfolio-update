import type { YearMonth } from '@/types'

const parse = (value: YearMonth) => value.split('-').map(Number) as [year: number, month: number]

/** Months since year 0, for sorting: later months are larger. */
export function monthIndex(value: YearMonth) {
  const [year, month] = parse(value)
  return year * 12 + month
}

const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })

/** "Nov 2020". */
export function formatMonth(value: YearMonth) {
  const [year, month] = parse(value)
  return monthFormat.format(new Date(Date.UTC(year, month - 1)))
}
