import { type ClassValue, clsx } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateMedium(date: string): string {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED);
}

export function formatDateShort(date: string): string {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_SHORT);
}
