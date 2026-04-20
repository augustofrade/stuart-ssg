import { PROJECT_LOCALE } from "../core/project-locale";

export function defaultDateFormatter(date: Date | string, locale?: string) {
  if (typeof date === "string") date = new Date(date);
  return date.toLocaleString(locale ?? PROJECT_LOCALE.value);
}
