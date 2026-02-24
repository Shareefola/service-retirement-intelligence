'use client';

import { useState, useRef, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import DatePickerDropdown from '@/components/calculator/DatePickerDropdown';

interface SmartDateInputProps {
  id: string;
  value: string; // ISO format YYYY-MM-DD
  onChange: (isoValue: string) => void;
  onBlur?: () => void;
  hasError?: boolean;
  placeholder?: string;
  max?: string;
  min?: string;
}

/**
 * SmartDateInput
 * - Accepts typed DD/MM/YYYY with auto-slash insertion
 * - Calendar icon opens a custom 3-column scroll picker (Day / Month / Year)
 * - Emits YYYY-MM-DD to React Hook Form
 */
export default function SmartDateInput({
  id,
  value,
  onChange,
  onBlur,
  hasError = false,
  placeholder = 'DD / MM / YYYY',
  max,
  min,
}: SmartDateInputProps) {
  const [display, setDisplay] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync display when RHF value changes externally (form reset etc.)
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split('-');
      if (y && m && d) setDisplay(`${d}/${m}/${y}`);
    } else {
      setDisplay('');
    }
  }, [value]);

  // Convert DD/MM/YYYY → YYYY-MM-DD
  function toISO(dmy: string): string {
    const clean = dmy.replace(/\D/g, '');
    if (clean.length < 8) return '';
    const d = clean.slice(0, 2);
    const m = clean.slice(2, 4);
    const y = clean.slice(4, 8);
    const date = new Date(`${y}-${m}-${d}T00:00:00`);
    if (isNaN(date.getTime())) return '';
    return `${y}-${m}-${d}`;
  }

  // Auto-format typed input — insert slashes at positions 2 and 4
  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digitsOnly = e.target.value.replace(/[^\d]/g, '');
    let formatted = '';
    for (let i = 0; i < Math.min(digitsOnly.length, 8); i++) {
      if (i === 2 || i === 4) formatted += '/';
      formatted += digitsOnly[i];
    }
    setDisplay(formatted);
    if (digitsOnly.length === 8) {
      const iso = toISO(formatted);
      onChange(iso || '');
    } else {
      onChange('');
    }
  }

  // Clean backspace over auto-inserted slashes
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && display.endsWith('/')) {
      e.preventDefault();
      setDisplay(display.slice(0, -1));
      onChange('');
    }
  }

  // Called by DatePickerDropdown when user scrolls to a date
  function handlePickerChange(iso: string) {
    onChange(iso);
    if (iso) {
      const [y, m, d] = iso.split('-');
      setDisplay(`${d}/${m}/${y}`);
    }
  }

  const borderColor = hasError
    ? '#C0392B'
    : pickerOpen
    ? '#8C6D4F'
    : display.length > 0
    ? 'rgba(26,22,20,0.35)'
    : 'rgba(26,22,20,0.2)';

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      {/* ── Text input ─────────────────────────────────────────────────── */}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={10}
        autoComplete="off"
        style={{
          width: '100%',
          padding: '12px 48px 12px 16px',
          border: `1px solid ${borderColor}`,
          borderRadius: 10,
          fontSize: 15,
          fontFamily: 'var(--font-body)',
          background: '#FAFAF9',
          color: '#1A1614',
          outline: 'none',
          letterSpacing: '0.04em',
          transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#8C6D4F';
        }}
        onBlurCapture={(e) => {
          if (!pickerOpen) e.currentTarget.style.borderColor = borderColor;
        }}
      />

      {/* ── Calendar icon ───────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setPickerOpen((o) => !o)}
        aria-label="Open date picker"
        aria-expanded={pickerOpen}
        style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          background: pickerOpen ? '#F0EBE5' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: pickerOpen ? '#1A1614' : '#8C6D4F',
          padding: 5,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 6,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!pickerOpen) e.currentTarget.style.color = '#1A1614';
        }}
        onMouseLeave={(e) => {
          if (!pickerOpen) e.currentTarget.style.color = '#8C6D4F';
        }}
      >
        <CalendarIcon size={17} />
      </button>

      {/* ── Dropdown picker ─────────────────────────────────────────────── */}
      {pickerOpen && (
        <DatePickerDropdown
          value={value}
          onChange={handlePickerChange}
          onClose={() => setPickerOpen(false)}
          anchorRef={wrapperRef}
          min={min}
          max={max}
        />
      )}
    </div>
  );
}
