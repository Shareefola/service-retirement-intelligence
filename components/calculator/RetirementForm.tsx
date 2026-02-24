'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculatorSchema, CalculatorFormValues } from '@/lib/validation';
import { useSettingsStore } from '@/store/settingsStore';
import { InfoIcon } from 'lucide-react';
import SmartDateInput from '@/components/calculator/SmartDateInput';

interface Props {
  onCompute: (values: CalculatorFormValues) => void;
}

export default function RetirementForm({ onCompute }: Props) {
  const { settings } = useSettingsStore();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      dob: '',
      doa: '',
      isResearchFellow: false,
    },
  });

  const isResearchFellow = watch('isResearchFellow');

  // Format the active cutoff date for display
  const cutoffDisplay =
    settings.cutoffDate instanceof Date
      ? settings.cutoffDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : '30 Jun 2004';

  return (
    <form onSubmit={handleSubmit(onCompute)} noValidate>
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 24,
          marginBottom: 6,
          letterSpacing: '-0.02em',
          color: '#1A1614',
        }}
      >
        Employee Parameters
      </h2>
      <p
        style={{
          fontSize: 14,
          color: '#5C4A3A',
          marginBottom: 28,
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
        }}
      >
        Type a date as <strong style={{ fontStyle: 'normal' }}>DD/MM/YYYY</strong> or
        use the{' '}
        <span style={{ color: '#8C6D4F' }}>
          calendar icon
        </span>{' '}
        to pick.
      </p>

      {/* ── Date of Birth ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: 22 }}>
        <label
          className="label-mono"
          htmlFor="dob"
          style={{ display: 'block', marginBottom: 8 }}
        >
          Date of Birth
        </label>
        <Controller
          name="dob"
          control={control}
          render={({ field }) => (
            <SmartDateInput
              id="dob"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              hasError={!!errors.dob}
              max={new Date().toISOString().split('T')[0]}
            />
          )}
        />
        {errors.dob && (
          <p
            style={{
              fontSize: 12,
              color: '#C0392B',
              marginTop: 6,
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            ⚠ {errors.dob.message}
          </p>
        )}
      </div>

      {/* ── Date of First Appointment ─────────────────────────────────── */}
      <div style={{ marginBottom: 22 }}>
        <label
          className="label-mono"
          htmlFor="doa"
          style={{ display: 'block', marginBottom: 8 }}
        >
          Date of First Appointment
        </label>
        <Controller
          name="doa"
          control={control}
          render={({ field }) => (
            <SmartDateInput
              id="doa"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              hasError={!!errors.doa}
              max={new Date().toISOString().split('T')[0]}
            />
          )}
        />
        {errors.doa && (
          <p
            style={{
              fontSize: 12,
              color: '#C0392B',
              marginTop: 6,
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            ⚠ {errors.doa.message}
          </p>
        )}
      </div>

      {/* ── Research Fellow Toggle ─────────────────────────────────────── */}
      <div style={{ marginBottom: 22 }}>
        <span
          className="label-mono"
          style={{ display: 'block', marginBottom: 8 }}
        >
          Research Fellow Status
        </span>
        <button
          type="button"
          onClick={() => setValue('isResearchFellow', !isResearchFellow)}
          aria-checked={isResearchFellow}
          role="switch"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 16px',
            border: isResearchFellow
              ? '1px solid #8C6D4F'
              : '1px solid rgba(26,22,20,0.15)',
            borderRadius: 10,
            background: isResearchFellow ? '#FDF6EF' : '#FAFAF9',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
          }}
        >
          {/* Switch pill */}
          <div
            style={{
              width: 40,
              height: 22,
              borderRadius: 11,
              background: isResearchFellow ? '#8C6D4F' : '#D0C8C0',
              position: 'relative',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 3,
                left: isResearchFellow ? 21 : 3,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.2s',
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                color: '#1A1614',
              }}
            >
              {isResearchFellow
                ? 'Research Fellow — Active'
                : 'Standard Employee'}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#8C6D4F',
                fontFamily: 'var(--font-mono)',
                marginTop: 2,
              }}
            >
              {isResearchFellow
                ? `Retires at age ${settings.researchFellowAge} — overrides all service limits`
                : `Earlier of age ${settings.retirementAge} or ${settings.serviceCap} years of service`}
            </div>
          </div>
        </button>
      </div>

      {/* ── Active config summary ──────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
          padding: '12px 14px',
          background: '#F7F5F2',
          borderRadius: 10,
          marginBottom: 20,
          fontSize: 12,
          color: '#8C6D4F',
          fontFamily: 'var(--font-mono)',
          border: '1px solid rgba(140,109,79,0.12)',
          lineHeight: 1.6,
        }}
      >
        <InfoIcon size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          Active config: Age {settings.retirementAge} · Cap {settings.serviceCap}yr ·
          RF age {settings.researchFellowAge} · Cutoff {cutoffDisplay}
        </span>
      </div>

      {/* ── Submit ────────────────────────────────────────────────────── */}
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '14px',
          background: '#1A1614',
          color: '#F7F5F2',
          border: 'none',
          borderRadius: 10,
          fontSize: 15,
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
          letterSpacing: '0.02em',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Compute Retirement Date →
      </button>
    </form>
  );
}
