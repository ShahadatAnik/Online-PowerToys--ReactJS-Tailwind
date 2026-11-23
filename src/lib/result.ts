/** A minimal success-or-error union for pure functions that can fail on user input. */
export type Result<T> = { ok: true; value: T } | { ok: false; error: string }
