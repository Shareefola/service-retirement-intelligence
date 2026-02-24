'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { calculatorSchema, CalculatorFormValues } from '@/lib/validation';
import { useSettingsStore } from '@/store/settingsStore';
import { formatDate } from 'date-fns';
import { InfoIcon } from 'lucide-react';

interface Props {
  onCompute: (values: CalculatorFormValues) => void;
}

export default function RetirementForm({ onCompute }: Props) {
  const { settings } = useSettingsStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CalculatorFormValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: { isResearchFellow: false },
  });

  const isResearchFellow = watch('isResearchFellow');

  return (
    <form onSubmit={handleSubmit(onCompute)} noValidate>
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 24,
          marginBottom: 6,
          letterSpacing: '-0.02em',
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
        Enter all details with precision. All fields are required.
      </p>

      {/* DOB */}
      <div style={{ marginBottom: 22 }}>
        <label className="label-mono" htmlFor="dob" style={{ display: 'block', marginBottom: 8 }}>
          Date of Birth
        </label>
        <input
          id="dob"
          type="date"
          {...register('dob')}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: errors.dob ? '1px solid #C0392B' : '1px solid rgba(26,22,20,0.2)',
            borderRadius: 10,
            fontSize: 15,
            fontFamily: 'var(--font-body)',
            background: '#FAFAF9',
            color: '#1A1614',
            outline: 'none',
          }}
        />
        {errors.dob && (
          <p style={{ fontSize: 12, color: '#C0392B', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            ⚠ {errors.dob.message}
          </p>
        )}
      </div>

      {/* DOA */}
      <div style={{ marginBottom: 22 }}>
        <label className="label-mono" htmlFor="doa" style={{ display: 'block', marginBottom: 8 }}>
          Date of First Appointment
        </label>
        <input
          id="doa"
          type="date"
          {...register('doa')}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: errors.doa ? '1px solid #C0392B' : '1px solid rgba(26,22,20,0.2)',
            borderRadius: 10,
            fontSize: 15,
            fontFamily: 'var(--font-body)',
            background: '#FAFAF9',
            color: '#1A1614',
            outline: 'none',
          }}
        />
        {errors.doa && (
          <p style={{ fontSize: 12, color: '#C0392B', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
            ⚠ {errors.doa.message}
          </p>
        )}
      </div>

      {/* Research Fellow toggle */}
      <div style={{ marginBottom: 22 }}>
        <span className="label-mono" style={{ display: 'block', marginBottom: 8 }}>
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
            border: isResearchFellow ? '1px solid #8C6D4F' : '1px solid rgba(26,22,20,0.15)',
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
            <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)', color: '#1A1614' }}>
              {isResearchFellow ? 'Research Fellow — Active' : 'Standard Employee'}
            </div>
            <div style={{ fontSize: 12, color: '#8C6D4F', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
              {isResearchFellow
                ? `Retires at age ${settings.researchFellowAge} — overrides all service limits`
                : `Earlier of age ${settings.retirementAge} or ${settings.serviceCap} years of service`}
            </div>
          </div>
        </button>
      </div>

      {/* Config summary */}
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
        }}
      >
        <InfoIcon size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          Active config: Age {settings.retirementAge} · Cap {settings.serviceCap}yr ·
          RF age {settings.researchFellowAge} · Cutoff{' '}
          {settings.cutoffDate instanceof Date
            ? settings.cutoffDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '30 Jun 2004'}
        </span>
      </div>

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
