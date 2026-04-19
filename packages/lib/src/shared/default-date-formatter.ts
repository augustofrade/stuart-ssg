import { PROJECT_LOCALE } from "../core/project-locale";

export function defaultDateFormatter(date: Date, locale?: string) {
  return date.toLocaleString(locale ?? PROJECT_LOCALE.value);
}
