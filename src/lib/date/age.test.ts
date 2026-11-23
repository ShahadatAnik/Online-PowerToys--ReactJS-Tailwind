import { describe, expect, test } from "bun:test"
import { calculateAge } from "./age"

const d = (iso: string) => {
  const [y, m, day] = iso.split("-").map(Number)
  return new Date(y ?? 0, (m ?? 1) - 1, day ?? 1)
}

function age(from: string, to: string) {
  const result = calculateAge(d(from), d(to))
  if (!result.ok) throw new Error(result.error)
  return result.value
}

describe("calculateAge", () => {
  test("computes a calendar-accurate breakdown", () => {
    const result = age("1995-08-15", "2024-11-23")
    expect([result.years, result.months, result.days]).toEqual([29, 3, 8])
    expect(result.totalMonths).toBe(351)
    expect(result.remainderDaysAfterMonths).toBe(8)
    expect(result.totalDays).toBe(10693)
    expect(result.totalWeeks).toBe(1527)
    expect(result.remainderDaysAfterWeeks).toBe(4)
    expect(result.totalHours).toBe(10693 * 24)
    expect(result.bornOnWeekday).toBe("Tuesday")
  })

  test("handles the same day", () => {
    const result = age("2020-01-01", "2020-01-01")
    expect([result.years, result.months, result.days, result.totalDays]).toEqual([0, 0, 0, 0])
    expect(result.isBirthday).toBe(false)
  })

  test("detects birthdays and counts down to the next one", () => {
    const today = age("2000-03-10", "2025-03-10")
    expect(today.isBirthday).toBe(true)
    expect(today.years).toBe(25)
    expect(today.daysUntilNextBirthday).toBe(365)

    const soon = age("2000-03-10", "2025-03-01")
    expect(soon.isBirthday).toBe(false)
    expect(soon.daysUntilNextBirthday).toBe(9)
    expect(soon.ageAtNextBirthday).toBe(25)
  })

  test("handles leap-day birthdays", () => {
    const result = age("2000-02-29", "2023-03-01")
    expect(result.years).toBe(23)
    expect(result.nextBirthday.getMonth()).toBe(1)
    expect(result.nextBirthday.getDate()).toBe(29)
    expect(result.nextBirthday.getFullYear()).toBe(2024)
  })

  test("handles end-of-month spans", () => {
    const result = age("2024-01-31", "2024-03-01")
    expect([result.years, result.months, result.days]).toEqual([0, 1, 1])
    expect(result.totalDays).toBe(30)
  })

  test("rejects a start date after the end date", () => {
    expect(calculateAge(d("2025-01-02"), d("2025-01-01")).ok).toBe(false)
  })

  test("rejects invalid dates", () => {
    expect(calculateAge(new Date(Number.NaN), d("2025-01-01")).ok).toBe(false)
  })
})
