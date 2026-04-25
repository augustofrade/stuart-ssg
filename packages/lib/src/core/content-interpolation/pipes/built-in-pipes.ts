import { PROJECT_LOCALE } from "../../project-locale";
import { ContentInterpolationPipes } from "./pipes";

// String pipes

export function lower(value: string): string {
  return value.toLowerCase();
}

export function upper(value: string): string {
  return value.toUpperCase();
}

export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-");
}

export function truncate(value: string, length: string | number): string {
  const max = Number(length);
  if (isNaN(max) || value.length <= max) return value;
  return value.slice(0, max) + "…";
}

export function length(value: string | unknown[]): number {
  return value.length;
}

export function first(value: string | unknown[]): unknown {
  return typeof value === "string" ? value.charAt(0) : value[0];
}

export function last(value: string | unknown[]): unknown {
  return typeof value === "string" ? value.charAt(value.length - 1) : value[value.length - 1];
}

export function defaultValue(value: unknown, fallback: string): unknown {
  return value !== undefined && value !== null && value !== "" ? value : fallback;
}

// Date pipes

export function timeAgo(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  // TODO: internationalize this
  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek !== 1 ? "s" : ""} ago`;
  if (diffMonth < 12) return `${diffMonth} month${diffMonth !== 1 ? "s" : ""} ago`;
  return `${diffYear} year${diffYear !== 1 ? "s" : ""} ago`;
}

export function defaultDateFormatter(date: Date | string, locale?: string) {
  if (typeof date === "string") date = new Date(date);
  return date.toLocaleString(locale ?? PROJECT_LOCALE.value);
}

// Registration

export function registerBuiltInPipes(): void {
  ContentInterpolationPipes.registerPipe("lower", lower);
  ContentInterpolationPipes.registerPipe("upper", upper);
  ContentInterpolationPipes.registerPipe("capitalize", capitalize);
  ContentInterpolationPipes.registerPipe("slug", slug);
  ContentInterpolationPipes.registerPipe("truncate", truncate);
  ContentInterpolationPipes.registerPipe("length", length);
  ContentInterpolationPipes.registerPipe("first", first);
  ContentInterpolationPipes.registerPipe("last", last);
  ContentInterpolationPipes.registerPipe("default", defaultValue);
  ContentInterpolationPipes.registerPipe("time_ago", timeAgo);
  ContentInterpolationPipes.registerPipe("date", defaultDateFormatter);
}
