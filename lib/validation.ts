/**
 * validation.ts
 * Zod schemas for all form inputs across SRI.
 */

import { z } from 'zod';

const dateString = z
  .string()
  .min(1, 'Date is required')
  .refine((val) => {
    const d = new Date(val + 'T00:00:00');
    return !isNaN(d.getTime());
  }, 'Invalid date format');

export const calculatorSchema = z
  .object({
    dob: dateString,
    doa: dateString,
    isResearchFellow: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const dob = new Date(data.dob + 'T00:00:00');
    const doa = new Date(data.doa + 'T00:00:00');
    const today = new Date();

    if (dob >= today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date of Birth must be in the past',
        path: ['dob'],
      });
    }

    if (doa <= dob) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date of First Appointment must be after Date of Birth',
        path: ['doa'],
      });
    }

    // Minimum age at appointment: 16 years
    const minAppointmentDate = new Date(dob);
    minAppointmentDate.setFullYear(minAppointmentDate.getFullYear() + 16);
    if (doa < minAppointmentDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Employee must be at least 16 years old at appointment',
        path: ['doa'],
      });
    }
  });

export type CalculatorFormValues = z.infer<typeof calculatorSchema>;

export const settingsSchema = z.object({
  retirementAge: z
    .number()
    .min(40, 'Minimum retirement age is 40')
    .max(80, 'Maximum retirement age is 80'),
  serviceCap: z
    .number()
    .min(5, 'Minimum service cap is 5 years')
    .max(50, 'Maximum service cap is 50 years'),
  researchFellowAge: z
    .number()
    .min(40, 'Minimum is 40')
    .max(80, 'Maximum is 80'),
  cutoffDate: dateString,
  countryProfile: z.string(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
