import { type Dispatch, type SetStateAction, useEffect, useState } from "react"
import { STORAGE_PREFIX } from "@/lib/site"

/**
 * `useState` that is mirrored to localStorage.
 *
 * The first render always uses `initialValue` so prerendered HTML hydrates without
 * mismatches; the stored value is restored right after mount. Storage failures
 * (private mode, quota, blocked cookies) are ignored and the state keeps working.
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = STORAGE_PREFIX + key
  const [value, setValue] = useState<T>(initialValue)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw !== null) setValue(JSON.parse(raw) as T)
    } catch {
      // Ignore unreadable or malformed storage.
    }
    setHydrated(true)
  }, [storageKey])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value))
    } catch {
      // Ignore quota / access errors.
    }
  }, [hydrated, storageKey, value])

  return [value, setValue]
}
