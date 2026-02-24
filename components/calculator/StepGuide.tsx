'use client';

import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

const STEPS = [
  {
    title: 'Welcome to SRI',
    body: 'Service Retirement Intelligence is a precision computation platform for retirement date determination using exact calendar arithmetic, eliminating administrative inaccuracies in institutional environments.',
  },
  {
    title: 'Three Inputs Required',
    body: "You will need: the employee's Date of Birth (DOB), their Date of First Appointment (DOA), and whether they hold Research Fellow status — which activates a separate and superior retirement regime.",
  },
  {
    title: 'Research Fellow Override',
    body: `If the employee is a Research Fellow, retirement is computed at the Research Fellow retirement age. This rule overrides all service limits absolutely — no exceptions.`,
  },
  {
    title: 'Configure for Your Region',
    body: 'Visit Settings to apply a country profile (Nigeria, UK, USA) or configure custom retirement ages, service caps, and cutoff dates for your institution's specific regulatory framework.',
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function StepGuide({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const { markOnboardingComplete } = useSettingsStore();

  if (!open) return null;

  const handleClose = () => {
    markOnboardingComplete();
    onClose();
    setStep(0);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      handleClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(26,22,20,0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: 40,
          maxWidth: 480,
          width: '100%',
          position: 'relative',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#8C6D4F',
            padding: 4,
            display: 'flex',
          }}
          aria-label="Close guide"
        >
          <X size={18} />
        </button>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                height: 6,
                borderRadius: 3,
                width: i === step ? 28 : 8,
                background: i === step ? '#8C6D4F' : '#D0C8C0',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
            marginBottom: 10,
          }}
        >
          Step {step + 1} of {STEPS.length}
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26,
            marginBottom: 12,
            color: '#1A1614',
            lineHeight: 1.2,
          }}
        >
          {STEPS[step].title}
        </h2>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.75,
            color: '#5C4A3A',
            fontFamily: 'var(--font-body)',
            marginBottom: 32,
          }}
        >
          {STEPS[step].body}
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          <button
            onClick={handleClose}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid rgba(26,22,20,0.2)',
              borderRadius: 8,
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              color: '#5C4A3A',
            }}
          >
            Skip Tour
          </button>
          <button
            onClick={handleNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 24px',
              background: '#1A1614',
              color: '#F7F5F2',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
            }}
          >
            {step < STEPS.length - 1 ? 'Continue' : 'Begin Calculation'}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
