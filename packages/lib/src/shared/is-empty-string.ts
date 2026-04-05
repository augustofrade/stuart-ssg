/**
 * Determines whether a string is considered empty.
 *
 * A value is considered empty if it is:
 * - `null` or `undefined`
 * - A string with no content after trimming whitespace
 *
 * @param value - The value to check
 * @returns `true` if the value is empty, `false` otherwise
 */
export function isEmptyString(value: string | null | undefined) {
  if (value === null || value === undefined) return true;

  if (typeof value === "string" && value.trim().length === 0) return true;

  return false;
}
