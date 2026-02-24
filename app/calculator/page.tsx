'use client';

import { useState, useMemo } from 'react';
import RetirementForm from '@/components/calculator/RetirementForm';
import ResultsPanel from '@/components/calculator/ResultsPanel';
import StepGuide from '@/components/calculator/StepGuide';
import { computeRetirement, RetirementResult } from '@/lib/retirementEngine';
import { useSettingsStore } from '@/store/settingsStore';
import { parseDateSafe } from '@/lib/dateEngine';
import type { CalculatorFormValues } from '@/lib/validation';

export default function CalculatorPage() {
  const { settings } = useSettingsStore();
  const [result, setResult] = useState<RetirementResult | null>(null);
  const [showGuide, setShowGuide] = useState(!settings.hasSeenOnboarding);

  const handleCompute = (values: CalculatorFormValues) => {
    const dob = parseDateSafe(values.dob)!;
    const doa = parseDateSafe(values.doa)!;
    const config = {
      retirementAge: settings.retirementAge,
      serviceCap: settings.serviceCap,
      researchFellowAge: settings.researchFellowAge,
      cutoffDate: settings.cutoffDate instanceof Date
        ? settings.cutoffDate
        : new Date(settings.cutoffDateString + 'T00:00:00'),
    };
    const computed = computeRetirement(dob, doa, values.isResearchFellow, config);
    setResult(computed);
  };

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      <StepGuide open={showGuide} onClose={() => setShowGuide(false)} />

      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
            marginBottom: 12,
          }}
        >
          Retirement Computation
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            letterSpacing: '-0.02em',
            color: '#1A1614',
            marginBottom: 4,
          }}
        >
          Retirement Calculator
        </h1>
        <p
          style={{
            fontSize: 15,
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Exact calendar arithmetic — no approximations
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 32,
          alignItems: 'start',
        }}
      >
        {/* Form */}
        <div className="card" style={{ padding: 36 }}>
          <RetirementForm onCompute={handleCompute} />
        </div>

        {/* Results */}
        <div className="card" style={{ padding: 36, minHeight: 360 }}>
          <ResultsPanel result={result} />
        </div>
      </div>

      {/* Help strip */}
      <div
        style={{
          marginTop: 24,
          padding: '14px 18px',
          background: '#F7F5F2',
          borderRadius: 10,
          border: '1px solid rgba(26,22,20,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
          }}
        >
          Need to adjust retirement ages or service caps?
        </p>
        <a
          href="/settings"
          style={{
            fontSize: 13,
            color: '#1A1614',
            fontFamily: 'var(--font-mono)',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          Open Settings →
        </a>
      </div>
    </main>
  );
}
