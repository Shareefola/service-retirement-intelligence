'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/store/settingsStore';
import { COUNTRY_PROFILES } from '@/lib/countryProfiles';
import { Check } from 'lucide-react';

export default function SettingsPanel() {
  const { settings, setSettings, applyCountryProfile, resetToDefaults } = useSettingsStore();
  const [saved, setSaved] = useState(false);

  const [draft, setDraft] = useState({
    retirementAge: settings.retirementAge,
    serviceCap: settings.serviceCap,
    researchFellowAge: settings.researchFellowAge,
    cutoffDateString: settings.cutoffDateString,
    countryProfile: settings.countryProfile,
  });

  const handleApplyProfile = (profile: (typeof COUNTRY_PROFILES)[number]) => {
    applyCountryProfile(profile.id, profile.config);
    setDraft({
      retirementAge: profile.config.retirementAge,
      serviceCap: profile.config.serviceCap,
      researchFellowAge: profile.config.researchFellowAge,
      cutoffDateString:
        profile.config.cutoffDate.getFullYear() +
        '-' +
        String(profile.config.cutoffDate.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(profile.config.cutoffDate.getDate()).padStart(2, '0'),
      countryProfile: profile.id,
    });
    setSaved(false);
  };

  const handleSave = () => {
    setSettings({
      retirementAge: Number(draft.retirementAge),
      serviceCap: Number(draft.serviceCap),
      researchFellowAge: Number(draft.researchFellowAge),
      cutoffDateString: draft.cutoffDateString,
      countryProfile: draft.countryProfile,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    resetToDefaults();
    setDraft({
      retirementAge: 60,
      serviceCap: 35,
      researchFellowAge: 65,
      cutoffDateString: '2004-06-30',
      countryProfile: 'NG',
    });
    setSaved(false);
  };

  const inputStyle = {
    width: 90,
    padding: '8px 12px',
    border: '1px solid rgba(26,22,20,0.2)',
    borderRadius: 8,
    fontSize: 15,
    fontFamily: 'var(--font-body)',
    textAlign: 'center' as const,
    background: '#FAFAF9',
    color: '#1A1614',
    outline: 'none',
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 32,
        alignItems: 'start',
      }}
    >
      {/* Country Profiles */}
      <div className="card" style={{ padding: 32 }}>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 22,
            marginBottom: 6,
          }}
        >
          Country Profiles
        </h2>
        <p
          style={{
            fontSize: 14,
            color: '#5C4A3A',
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            marginBottom: 24,
          }}
        >
          Select a preset to auto-fill statutory retirement rules.
        </p>

        {COUNTRY_PROFILES.map((profile) => {
          const active = draft.countryProfile === profile.id;
          return (
            <button
              key={profile.id}
              onClick={() => handleApplyProfile(profile)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '13px 16px',
                marginBottom: 8,
                borderRadius: 10,
                border: active
                  ? '2px solid #8C6D4F'
                  : '1px solid rgba(26,22,20,0.15)',
                background: active ? '#FDF6EF' : '#FAFAF9',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 26, lineHeight: 1 }}>{profile.flag}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    color: '#1A1614',
                  }}
                >
                  {profile.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: '#8C6D4F',
                    fontFamily: 'var(--font-mono)',
                    marginTop: 2,
                  }}
                >
                  Age {profile.config.retirementAge} · {profile.config.serviceCap}yr ·
                  RF {profile.config.researchFellowAge}
                </div>
              </div>
              {active && (
                <div style={{ color: '#8C6D4F' }}>
                  <Check size={16} />
                </div>
              )}
            </button>
          );
        })}

        <div
          style={{
            marginTop: 16,
            padding: '12px 14px',
            background: '#F7F5F2',
            borderRadius: 10,
            fontSize: 12,
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.6,
          }}
        >
          Profile notes:{' '}
          {COUNTRY_PROFILES.find((p) => p.id === draft.countryProfile)?.notes[0] ??
            'Fully customisable.'}
        </div>
      </div>

      {/* Parameter Configuration */}
      <div className="card" style={{ padding: 32 }}>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 22,
            marginBottom: 6,
          }}
        >
          Parameters
        </h2>
        <p
          style={{
            fontSize: 14,
            color: '#5C4A3A',
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            marginBottom: 24,
          }}
        >
          Fine-tune individual parameters for your institution.
        </p>

        {(
          [
            {
              key: 'retirementAge',
              label: 'Retirement Age',
              sub: 'Standard mandatory retirement age',
              type: 'number',
            },
            {
              key: 'serviceCap',
              label: 'Service Cap (Years)',
              sub: 'Maximum allowable service period',
              type: 'number',
            },
            {
              key: 'researchFellowAge',
              label: 'Research Fellow Age',
              sub: 'Absolute override age for Research Fellows',
              type: 'number',
            },
            {
              key: 'cutoffDateString',
              label: 'Cutoff Date',
              sub: 'Service-to-cutoff computation reference',
              type: 'date',
            },
          ] as const
        ).map((field) => (
          <div
            key={field.key}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 0',
              borderBottom: '1px solid rgba(26,22,20,0.07)',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontFamily: 'var(--font-body)',
                  color: '#1A1614',
                }}
              >
                {field.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#8C6D4F',
                  fontFamily: 'var(--font-mono)',
                  marginTop: 2,
                }}
              >
                {field.sub}
              </div>
            </div>
            <input
              type={field.type}
              value={draft[field.key] as string | number}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  [field.key]:
                    field.type === 'number' ? Number(e.target.value) : e.target.value,
                }))
              }
              style={{
                ...inputStyle,
                width: field.type === 'date' ? 150 : 90,
                textAlign: field.type === 'date' ? 'left' : 'center',
                padding: field.type === 'date' ? '8px 10px' : '8px 12px',
              }}
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '13px',
            background: saved ? '#2E7D32' : '#8C6D4F',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'background 0.3s',
          }}
        >
          {saved && <Check size={16} />}
          {saved ? 'Saved Successfully' : 'Save Configuration'}
        </button>

        <button
          onClick={handleReset}
          style={{
            width: '100%',
            padding: '11px',
            background: 'transparent',
            color: '#8C6D4F',
            border: '1px solid rgba(140,109,79,0.3)',
            borderRadius: 10,
            fontSize: 14,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            marginTop: 8,
            transition: 'all 0.2s',
          }}
        >
          Restore Nigeria Defaults
        </button>

        <div
          style={{
            marginTop: 16,
            padding: '12px 14px',
            background: '#F7F5F2',
            borderRadius: 10,
            fontSize: 11,
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Active: Retirement {settings.retirementAge} · Cap {settings.serviceCap}yr · RF{' '}
          {settings.researchFellowAge} · Changes require Save
        </div>
      </div>
    </div>
  );
}
