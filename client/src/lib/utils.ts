import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a duration in seconds to a human-readable string (e.g., "2h 30m 15s")
 */
export function formatStudyTime(seconds: number): string {
  if (seconds === 0) return "0h 0m 0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

/**
 * Formats a date to a string (e.g., "April 2, 2023")
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    dateStyle: 'long'
  }).format(date);
}

/**
 * Formats a time to a string (e.g., "2:30 PM")
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true 
  }).format(date);
}

/**
 * Returns the total number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Creates a random ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Truncates a string to a specified length and adds ellipsis if truncated
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Calculates the time difference between two dates in seconds
 */
export function getTimeDifferenceInSeconds(start: Date, end: Date): number {
  return Math.floor((end.getTime() - start.getTime()) / 1000);
}

/**
 * Gets the appropriate color class based on the subject color
 */
export function getSubjectColorClass(colorClass: string, type: 'bg' | 'text' | 'border' = 'bg'): string {
  const color = colorClass.split('-')[1];
  return `${type}-${color}`;
}

/**
 * Groups an array of objects by a specific key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Checks if an object is empty
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}
