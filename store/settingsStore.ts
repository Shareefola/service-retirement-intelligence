/**
 * settingsStore.ts
 * Global settings store using Zustand with localStorage persistence.
 * Future-ready for Supabase sync when auth is implemented.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_CONFIG, RetirementConfig } from '@/lib/retirementEngine';
import { DEFAULT_PROFILE_ID } from '@/lib/countryProfiles';
import { formatDateInput } from '@/lib/dateEngine';

export interface AppSettings extends RetirementConfig {
  countryProfile: string;
  cutoffDateString: string; // ISO date string for form inputs
  theme: 'light' | 'dark' | 'system';
  hasSeenOnboarding: boolean;
}

interface SettingsState {
  settings: AppSettings;
  setSettings: (partial: Partial<AppSettings>) => void;
  applyCountryProfile: (profileId: string, config: RetirementConfig) => void;
  resetToDefaults: () => void;
  markOnboardingComplete: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  ...DEFAULT_CONFIG,
  countryProfile: DEFAULT_PROFILE_ID,
  cutoffDateString: formatDateInput(DEFAULT_CONFIG.cutoffDate),
  theme: 'system',
  hasSeenOnboarding: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,

      setSettings: (partial) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...partial,
            // Keep cutoffDate in sync with cutoffDateString
            cutoffDate: partial.cutoffDateString
              ? new Date(partial.cutoffDateString + 'T00:00:00')
              : state.settings.cutoffDate,
          },
        })),

      applyCountryProfile: (profileId, config) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...config,
            countryProfile: profileId,
            cutoffDateString: formatDateInput(config.cutoffDate),
          },
        })),

      resetToDefaults: () =>
        set({
          settings: {
            ...DEFAULT_SETTINGS,
            hasSeenOnboarding: true, // Don't re-trigger onboarding on reset
          },
        }),

      markOnboardingComplete: () =>
        set((state) => ({
          settings: { ...state.settings, hasSeenOnboarding: true },
        })),
    }),
    {
      name: 'sri-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
