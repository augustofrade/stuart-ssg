/**
 * Validates that a page frontmatter date string matches the expected format.
 * @param rawDate - The date string to validate in the format 'YYYY-MM-DD' or 'YYYY-MM-DD HH:mm:ss'
 * @returns `true` if the date string is invalid (does not match the expected format), `false` if valid
 */
export function isValidDateString(rawDate: string): boolean {
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/;

  return dateTimeRegex.exec(rawDate.trim()) !== null;
}
