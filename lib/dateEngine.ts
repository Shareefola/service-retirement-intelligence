/**
 * dateEngine.ts
 * Exact calendar difference engine using date-fns.
 * Computes true year/month/day differences — no approximations.
 */

import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addYears,
  addMonths,
  format,
} from 'date-fns';
import type { ExactDuration } from './retirementEngine';

/**
 * Computes exact calendar difference between two dates.
 * Uses successive subtraction to get years, then remaining months, then remaining days.
 * This is the gold-standard approach — no 30-day-month approximations.
 */
export function computeExactDifference(from: Date, to: Date): ExactDuration {
  const years = differenceInYears(to, from);
  const afterYears = addYears(from, years);

  const months = differenceInMonths(to, afterYears);
  const afterMonths = addMonths(afterYears, months);

  const days = differenceInDays(to, afterMonths);

  const totalDays = differenceInDays(to, from);

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (parts.length === 0) parts.push('0 days');

  return {
    years,
    months,
    days,
    totalDays,
    formatted: parts.join(', '),
  };
}

/**
 * Safely parses a date string in YYYY-MM-DD format.
 * Returns null on invalid input.
 */
export function parseDateSafe(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value + 'T00:00:00');
  if (isNaN(date.getTime())) return null;
  return date;
}

/**
 * Formats a date for display in institutional style.
 */
export function formatDateInstitutional(date: Date): string {
  return format(date, 'dd MMMM yyyy');
}

/**
 * Formats a date for HTML date input (YYYY-MM-DD).
 */
export function formatDateInput(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
