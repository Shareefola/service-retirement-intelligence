'use client';

import { RetirementResult } from '@/lib/retirementEngine';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { useState } from 'react';

interface Props {
  result: RetirementResult;
}

export default function ExportButton({ result }: Props) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ format: 'a4', unit: 'mm' });
      const W = 210;
      const MARGIN = 20;
      let y = MARGIN;

      // ── Helpers ──────────────────────────────────────────────────────────
      const line = (text: string, size: number, style: string = 'normal', color: [number, number, number] = [26, 22, 20]) => {
        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);
        doc.text(text, MARGIN, y);
        y += size * 0.45 + 2;
      };

      const rule = (opacity = 0.15) => {
        doc.setDrawColor(26, 22, 20);
        doc.setLineWidth(0.3);
        doc.setGState(doc.GState({ opacity }));
        doc.line(MARGIN, y, W - MARGIN, y);
        doc.setGState(doc.GState({ opacity: 1 }));
        y += 6;
      };

      const kv = (key: string, value: string) => {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(140, 109, 79);
        doc.text(key.toUpperCase(), MARGIN, y);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(26, 22, 20);
        doc.text(value, MARGIN + 65, y);
        y += 7;
      };

      // ── Logotype ─────────────────────────────────────────────────────────
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(26, 22, 20);
      doc.text('SRI', MARGIN, y + 2);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(140, 109, 79);
      doc.text('Service Retirement Intelligence', MARGIN + 18, y + 2);
      y += 12;
      rule(0.2);

      // ── Document header ───────────────────────────────────────────────────
      line('RETIREMENT COMPUTATION REPORT', 16, 'bold');
      y += 2;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(140, 109, 79);
      doc.text(`Generated: ${format(result.computedAt, 'dd MMMM yyyy, HH:mm')}`, MARGIN, y);
      y += 10;
      rule();

      // ── Result ────────────────────────────────────────────────────────────
      line('MANDATORY RETIREMENT DATE', 9, 'normal', [140, 109, 79]);
      y += 2;
      line(result.formattedRetirementDate, 22, 'bold');
      y += 2;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const BADGE_COLORS: Record<string, [number, number, number]> = {
        RESEARCH_FELLOW: [21, 101, 192],
        AGE_LIMIT: [230, 81, 0],
        SERVICE_LIMIT: [46, 125, 50],
      };
      doc.setTextColor(...(BADGE_COLORS[result.trigger] ?? [26, 22, 20]));
      doc.text(`▶  ${result.triggerLabel}`, MARGIN, y);
      y += 12;
      rule();

      // ── Computations ──────────────────────────────────────────────────────
      line('COMPUTATION DETAIL', 9, 'normal', [140, 109, 79]);
      y += 4;
      kv('Total Length of Service', result.totalService.formatted);
      kv(
        'Service to Cutoff',
        result.serviceToCutoff ? result.serviceToCutoff.formatted : 'Not Applicable'
      );
      if (result.ageLimitDate)
        kv('Age Limit Date', format(result.ageLimitDate, 'dd MMMM yyyy'));
      if (result.serviceLimitDate)
        kv('Service Limit Date', format(result.serviceLimitDate, 'dd MMMM yyyy'));
      y += 4;
      rule();

      // ── Rule explanation ──────────────────────────────────────────────────
      line('GOVERNING RULE', 9, 'normal', [140, 109, 79]);
      y += 4;
      const splitRule = doc.splitTextToSize(result.triggerDescription, W - MARGIN * 2);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(92, 74, 58);
      doc.text(splitRule, MARGIN, y);
      y += splitRule.length * 5.5 + 6;
      rule();

      // ── Input parameters ──────────────────────────────────────────────────
      line('INPUT PARAMETERS', 9, 'normal', [140, 109, 79]);
      y += 4;
      kv('Date of Birth', format(result.inputs.dob, 'dd MMMM yyyy'));
      kv('Date of First Appointment', format(result.inputs.doa, 'dd MMMM yyyy'));
      kv(
        'Research Fellow Status',
        result.inputs.isResearchFellow ? 'Yes — Research Fellow Regime' : 'No — Standard Regime'
      );
      y += 4;
      rule();

      // ── Configuration used ────────────────────────────────────────────────
      line('CONFIGURATION APPLIED', 9, 'normal', [140, 109, 79]);
      y += 4;
      kv('Retirement Age', `${result.config.retirementAge} years`);
      kv('Service Cap', `${result.config.serviceCap} years`);
      kv('Research Fellow Age', `${result.config.researchFellowAge} years`);
      kv('Cutoff Date', format(result.config.cutoffDate, 'dd MMMM yyyy'));
      y += 8;

      // ── Footer ────────────────────────────────────────────────────────────
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(184, 168, 152);
      doc.text(
        'This document was generated by Service Retirement Intelligence (SRI). Computations use exact calendar arithmetic.',
        MARGIN,
        285,
        { maxWidth: W - MARGIN * 2 }
      );

      doc.save(
        `SRI-Retirement-${format(result.inputs.dob, 'yyyy-MM-dd')}-${format(result.computedAt, 'yyyyMMdd-HHmm')}.pdf`
      );
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '10px 18px',
        background: loading ? '#888' : '#1A1614',
        color: '#F7F5F2',
        border: 'none',
        borderRadius: 8,
        fontSize: 13,
        fontFamily: 'var(--font-body)',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <Download size={15} />
      {loading ? 'Generating…' : 'Export PDF'}
    </button>
  );
}
