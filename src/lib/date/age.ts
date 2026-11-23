import {
  addMonths,
  addYears,
  differenceInCalendarDays,
  differenceInMonths,
  format,
  intervalToDuration,
  isAfter,
  isSameDay,
  startOfDay,
} from "date-fns"
import type { Result } from "@/lib/result"

export interface AgeBreakdown {
  /** Calendar-accurate age, e.g. 29 years 3 months 12 days. */
  years: number
  months: number
  days: number
  /** Alternative representations of the same span. */
  totalMonths: number
  remainderDaysAfterMonths: number
  totalWeeks: number
  remainderDaysAfterWeeks: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  /** Weekday of the start date, e.g. "Monday". */
  bornOnWeekday: string
  /** True when `to` is an anniversary of `from` (Feb 29 falls back to Feb 28). */
  isBirthday: boolean
  nextBirthday: Date
  daysUntilNextBirthday: number
  ageAtNextBirthday: number
}

/**
 * Calculates the calendar-accurate span between two dates (time of day is ignored).
 * Uses real month/year lengths, so leap years and short months are handled correctly.
 */
export function calculateAge(fromInput: Date, toInput: Date): Result<AgeBreakdown> {
  const from = startOfDay(fromInput)
  const to = startOfDay(toInput)

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return { ok: false, error: "Please pick two valid dates." }
  }
  if (isAfter(from, to)) {
    return { ok: false, error: "The start date must be on or before the end date." }
  }

  const { years = 0, months = 0, days = 0 } = intervalToDuration({ start: from, end: to })
  const totalMonths = differenceInMonths(to, from)
  const totalDays = differenceInCalendarDays(to, from)

  const lastAnniversary = addYears(from, years)
  const nextBirthday = addYears(from, years + 1)

  return {
    ok: true,
    value: {
      years,
      months,
      days,
      totalMonths,
      remainderDaysAfterMonths: differenceInCalendarDays(to, addMonths(from, totalMonths)),
      totalWeeks: Math.floor(totalDays / 7),
      remainderDaysAfterWeeks: totalDays % 7,
      totalDays,
      totalHours: totalDays * 24,
      totalMinutes: totalDays * 24 * 60,
      totalSeconds: totalDays * 24 * 60 * 60,
      bornOnWeekday: format(from, "EEEE"),
      isBirthday: years > 0 && isSameDay(lastAnniversary, to),
      nextBirthday,
      daysUntilNextBirthday: differenceInCalendarDays(nextBirthday, to),
      ageAtNextBirthday: years + 1,
    },
  }
}
