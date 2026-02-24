/**
 * countryProfiles.ts
 * International retirement configuration presets.
 * Each profile represents the statutory retirement rules for that jurisdiction.
 */

import type { RetirementConfig } from './retirementEngine';

export interface CountryProfile {
  id: string;
  name: string;
  flag: string;
  description: string;
  config: RetirementConfig;
  notes: string[];
}

export const COUNTRY_PROFILES: CountryProfile[] = [
  {
    id: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    description: 'Federal Civil Service Commission regulations',
    config: {
      retirementAge: 60,
      serviceCap: 35,
      researchFellowAge: 65,
      cutoffDate: new Date(2004, 5, 30),
    },
    notes: [
      'Governed by the Pension Reform Act 2014',
      'Research Fellows retire at 65 per NUC guidelines',
      'Cutoff date of 30 June 2004 per Harmonized Terms & Conditions of Service',
    ],
  },
  {
    id: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    description: 'Public sector pension and retirement framework',
    config: {
      retirementAge: 66,
      serviceCap: 40,
      researchFellowAge: 68,
      cutoffDate: new Date(2006, 3, 1),
    },
    notes: [
      'State Pension Age currently 66, rising to 67 by 2028',
      'Civil Service Pension Scheme alpha applies to most staff',
      'Mandatory retirement age largely abolished under Equality Act 2010',
    ],
  },
  {
    id: 'US',
    name: 'United States',
    flag: '🇺🇸',
    description: 'Federal Employee Retirement System (FERS)',
    config: {
      retirementAge: 62,
      serviceCap: 30,
      researchFellowAge: 70,
      cutoffDate: new Date(2003, 0, 1),
    },
    notes: [
      'FERS Minimum Retirement Age is 55–57 depending on birth year',
      'Immediate retirement at 62 with 5+ years of service',
      'Research/Senior roles may defer under FERS supplemental provisions',
    ],
  },
  {
    id: 'CUSTOM',
    name: 'Custom Configuration',
    flag: '🌐',
    description: 'Define your own jurisdiction-specific rules',
    config: {
      retirementAge: 60,
      serviceCap: 35,
      researchFellowAge: 65,
      cutoffDate: new Date(2004, 5, 30),
    },
    notes: [
      'Fully configurable — adjust all parameters as required',
      'Suitable for institutional, regional, or custom regulatory environments',
    ],
  },
];

export function getProfileById(id: string): CountryProfile | undefined {
  return COUNTRY_PROFILES.find((p) => p.id === id);
}

export const DEFAULT_PROFILE_ID = 'NG';
