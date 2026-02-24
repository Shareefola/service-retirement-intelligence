/**
 * retirementEngine.ts
 * Core retirement computation engine for Service Retirement Intelligence
 * Uses exact calendar logic via date-fns — no 30-day approximations.
 */

import {
  addYears,
  isBefore,
  isAfter,
  isEqual,
  format,
  differenceInCalendarDays,
} from 'date-fns';
import { computeExactDifference } from './dateEngine';

export type RetirementTrigger =
  | 'AGE_LIMIT'
  | 'SERVICE_LIMIT'
  | 'RESEARCH_FELLOW';

export interface RetirementConfig {
  retirementAge: number;          // default: 60
  serviceCap: number;             // default: 35
  researchFellowAge: number;      // default: 65
  cutoffDate: Date;               // default: 2004-06-30
}

export interface ExactDuration {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  formatted: string;
}

export interface RetirementResult {
  retirementDate: Date;
  formattedRetirementDate: string;
  trigger: RetirementTrigger;
  triggerLabel: string;
  triggerDescription: string;

  ageLimitDate: Date | null;
  serviceLimitDate: Date | null;

  serviceToCutoff: ExactDuration | null;
  totalService: ExactDuration;

  inputs: {
    dob: Date;
    doa: Date;
    isResearchFellow: boolean;
  };

  config: RetirementConfig;
  computedAt: Date;
}

export const DEFAULT_CONFIG: RetirementConfig = {
  retirementAge: 60,
  serviceCap: 35,
  researchFellowAge: 65,
  cutoffDate: new Date(2004, 5, 30), // June 30, 2004
};

/**
 * Main retirement computation function.
 * Implements exact calendar logic as mandated by business rules.
 */
export function computeRetirement(
  dob: Date,
  doa: Date,
  isResearchFellow: boolean,
  config: RetirementConfig = DEFAULT_CONFIG
): RetirementResult {
  const now = new Date();

  // ─── CASE 1: Research Fellow Override ─────────────────────────────────────
  if (isResearchFellow) {
    const retirementDate = addYears(dob, config.researchFellowAge);
    const totalService = computeExactDifference(doa, retirementDate);
    const serviceToCutoff = computeServiceToCutoff(doa, config.cutoffDate);

    return {
      retirementDate,
      formattedRetirementDate: format(retirementDate, 'dd MMMM yyyy'),
      trigger: 'RESEARCH_FELLOW',
      triggerLabel: 'Research Fellow Age Limit',
      triggerDescription: `Retirement is governed by the Research Fellow provision. Mandatory retirement occurs at age ${config.researchFellowAge}, overriding all service limits.`,
      ageLimitDate: null,
      serviceLimitDate: null,
      serviceToCutoff,
      totalService,
      inputs: { dob, doa, isResearchFellow },
      config,
      computedAt: now,
    };
  }

  // ─── CASE 2: Standard Retirement ──────────────────────────────────────────
  const ageLimitDate = addYears(dob, config.retirementAge);
  const serviceLimitDate = addYears(doa, config.serviceCap);

  // Retirement = Earlier of the two dates
  let retirementDate: Date;
  let trigger: RetirementTrigger;

  if (isBefore(ageLimitDate, serviceLimitDate) || isEqual(ageLimitDate, serviceLimitDate)) {
    retirementDate = ageLimitDate;
    trigger = 'AGE_LIMIT';
  } else {
    retirementDate = serviceLimitDate;
    trigger = 'SERVICE_LIMIT';
  }

  const totalService = computeExactDifference(doa, retirementDate);
  const serviceToCutoff = computeServiceToCutoff(doa, config.cutoffDate);

  const triggerLabel =
    trigger === 'AGE_LIMIT'
      ? `Mandatory Retirement Age (${config.retirementAge})`
      : `Service Cap (${config.serviceCap} Years)`;

  const triggerDescription =
    trigger === 'AGE_LIMIT'
      ? `Retirement is triggered by reaching the mandatory retirement age of ${config.retirementAge}. This occurred before the service cap of ${config.serviceCap} years would have been reached on ${format(serviceLimitDate, 'dd MMMM yyyy')}.`
      : `Retirement is triggered by reaching the maximum service period of ${config.serviceCap} years on ${format(serviceLimitDate, 'dd MMMM yyyy')}. This occurred before the age limit of ${config.retirementAge} would have been reached on ${format(ageLimitDate, 'dd MMMM yyyy')}.`;

  return {
    retirementDate,
    formattedRetirementDate: format(retirementDate, 'dd MMMM yyyy'),
    trigger,
    triggerLabel,
    triggerDescription,
    ageLimitDate,
    serviceLimitDate,
    serviceToCutoff,
    totalService,
    inputs: { dob, doa, isResearchFellow },
    config,
    computedAt: now,
  };
}

/**
 * Computes service length from DOA to the cutoff date.
 * Returns null if DOA is after the cutoff date.
 */
function computeServiceToCutoff(
  doa: Date,
  cutoffDate: Date
): ExactDuration | null {
  if (isAfter(doa, cutoffDate) || isEqual(doa, cutoffDate)) {
    return null;
  }
  return computeExactDifference(doa, cutoffDate);
}
