/**
 * Validates whether a given value is a valid date.
 * @param value - The value to validate. Can be a Date object or a string representation of a date.
 * @returns `true` if the value is a valid date, `false` otherwise.
 * @example
 * ```ts
 * isValidDate(new Date()); // true
 * isValidDate("2024-01-01"); // true
 * isValidDate("invalid"); // false
 * ```
 */
export function isValidDate(value: unknown | Date) {
  if (value instanceof Date) return !isNaN(value.getTime());

  if (typeof value === "string") return !isNaN(new Date(value).getTime());

  return false;
}
