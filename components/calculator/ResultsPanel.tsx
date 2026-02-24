'use client';

import { RetirementResult } from '@/lib/retirementEngine';
import ExportButton from '@/components/pdf/ExportButton';
import { format } from 'date-fns';
import { ClipboardCopy, Printer } from 'lucide-react';
import { useState } from 'react';

interface Props {
  result: RetirementResult | null;
}

const TRIGGER_STYLE: Record<string, { bg: string; color: string; border: string; icon: string }> = {
  RESEARCH_FELLOW: {
    bg: '#EBF3FF',
    color: '#1565C0',
    border: '#90CAF9',
    icon: '⬟',
  },
  AGE_LIMIT: {
    bg: '#FFF4E5',
    color: '#E65100',
    border: '#FFCC80',
    icon: '◆',
  },
  SERVICE_LIMIT: {
    bg: '#E8F5E9',
    color: '#2E7D32',
    border: '#A5D6A7',
    icon: '▲',
  },
};

export default function ResultsPanel({ result }: Props) {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '64px 24px',
          color: '#8C6D4F',
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 16, opacity: 0.3 }}>⊙</div>
        <h3
          style={{
            fontSize: 18,
            fontFamily: 'var(--font-serif)',
            color: '#5C4A3A',
            marginBottom: 8,
          }}
        >
          Awaiting Computation
        </h3>
        <p
          style={{
            fontSize: 14,
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            lineHeight: 1.7,
          }}
        >
          Complete the employee parameters and press
          <br />
          <em>"Compute Retirement Date"</em> to see the full analysis.
        </p>
      </div>
    );
  }

  const ts = TRIGGER_STYLE[result.trigger];

  const copyToClipboard = () => {
    const text = [
      'SRI — SERVICE RETIREMENT INTELLIGENCE',
      '=====================================',
      `Computed: ${format(result.computedAt, 'dd MMMM yyyy, HH:mm')}`,
      '',
      `Retirement Date:    ${result.formattedRetirementDate}`,
      `Trigger:            ${result.triggerLabel}`,
      '',
      `Total Service:      ${result.totalService.formatted}`,
      `  (${result.totalService.totalDays.toLocaleString()} calendar days)`,
      '',
      result.serviceToCutoff
        ? `Service to Cutoff:  ${result.serviceToCutoff.formatted}`
        : 'Service to Cutoff:  N/A (appointed after cutoff)',
      '',
      result.ageLimitDate
        ? `Age Limit Date:     ${format(result.ageLimitDate, 'dd MMMM yyyy')}`
        : '',
      result.serviceLimitDate
        ? `Service Limit Date: ${format(result.serviceLimitDate, 'dd MMMM yyyy')}`
        : '',
      '',
      `Rule: ${result.triggerDescription}`,
    ]
      .filter((l) => l !== null)
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(26,22,20,0.1)',
          paddingBottom: 24,
          marginBottom: 24,
        }}
      >
        <span
          className="label-mono"
          style={{ display: 'block', marginBottom: 8 }}
        >
          Mandatory Retirement Date
        </span>
        <div
          style={{
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontFamily: 'var(--font-serif)',
            letterSpacing: '-0.02em',
            marginBottom: 10,
            color: '#1A1614',
          }}
        >
          {result.formattedRetirementDate}
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
            background: ts.bg,
            color: ts.color,
            border: `1px solid ${ts.border}`,
          }}
        >
          {ts.icon} {result.triggerLabel}
        </span>
      </div>

      {/* Stats */}
      {(
        [
          {
            label: 'Total Length of Service',
            value: result.totalService.formatted,
            sub: `${result.totalService.totalDays.toLocaleString()} calendar days`,
          },
          result.serviceToCutoff
            ? {
                label: `Service to Cutoff (${format(result.config.cutoffDate, 'dd MMM yyyy')})`,
                value: result.serviceToCutoff.formatted,
                sub: `${result.serviceToCutoff.totalDays.toLocaleString()} calendar days`,
              }
            : {
                label: 'Service to Cutoff',
                value: 'Not Applicable',
                sub: 'Appointment falls after cutoff date',
              },
          result.ageLimitDate
            ? {
                label: 'Age Limit Date',
                value: format(result.ageLimitDate, 'dd MMMM yyyy'),
                sub: `At age ${result.config.retirementAge}`,
              }
            : null,
          result.serviceLimitDate
            ? {
                label: 'Service Limit Date',
                value: format(result.serviceLimitDate, 'dd MMMM yyyy'),
                sub: `After ${result.config.serviceCap} years`,
              }
            : null,
        ] as Array<{ label: string; value: string; sub: string } | null>
      )
        .filter(Boolean)
        .map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '13px 0',
              borderBottom: '1px solid rgba(26,22,20,0.06)',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: '#5C4A3A',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.02em',
                }}
              >
                {s!.label}
              </div>
              {s!.sub && (
                <div
                  style={{
                    fontSize: 11,
                    color: '#B8A898',
                    fontFamily: 'var(--font-mono)',
                    marginTop: 2,
                  }}
                >
                  {s!.sub}
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'var(--font-serif)',
                textAlign: 'right',
                maxWidth: '55%',
              }}
            >
              {s!.value}
            </div>
          </div>
        ))}

      {/* Rule note */}
      <div
        style={{
          background: '#F7F5F2',
          borderRadius: 10,
          padding: '14px 16px',
          marginTop: 20,
          fontSize: 13,
          color: '#5C4A3A',
          lineHeight: 1.7,
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          border: '1px solid rgba(26,22,20,0.07)',
        }}
      >
        <strong style={{ fontStyle: 'normal', color: '#1A1614' }}>Rule Applied: </strong>
        {result.triggerDescription}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
        <ExportButton result={result} />
        <button
          onClick={() => window.print()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            border: '1px solid rgba(26,22,20,0.2)',
            background: 'transparent',
            color: '#1A1614',
          }}
        >
          <Printer size={15} /> Print
        </button>
        <button
          onClick={copyToClipboard}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            border: '1px solid rgba(26,22,20,0.2)',
            background: copied ? '#E8F5E9' : 'transparent',
            color: copied ? '#2E7D32' : '#1A1614',
            transition: 'all 0.2s',
          }}
        >
          <ClipboardCopy size={15} /> {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div
        style={{
          marginTop: 14,
          fontSize: 11,
          color: '#B8A898',
          fontFamily: 'var(--font-mono)',
          textAlign: 'center',
        }}
      >
        Computed {format(result.computedAt, "dd MMM yyyy 'at' HH:mm")}
      </div>
    </div>
  );
}
