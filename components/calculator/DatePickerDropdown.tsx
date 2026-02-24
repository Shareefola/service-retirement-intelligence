'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface DatePickerDropdownProps {
  value: string; // YYYY-MM-DD
  onChange: (iso: string) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement>;
  min?: string;
  max?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5; // odd number so selected is centred

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

// ── Single scrollable column ────────────────────────────────────────────────
function ScrollColumn({
  items,
  selectedIndex,
  onSelect,
  formatLabel,
}: {
  items: number[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  formatLabel: (val: number) => string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);

  // Scroll to selected item
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = selectedIndex * ITEM_HEIGHT;
    }
  }, [selectedIndex]);

  // Snap to nearest item on scroll end
  const handleScroll = useCallback(() => {
    if (!listRef.current || isDragging.current) return;
    const raw = listRef.current.scrollTop;
    const snapped = Math.round(raw / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(snapped, items.length - 1));
    if (clamped !== selectedIndex) {
      onSelect(clamped);
    }
  }, [items.length, onSelect, selectedIndex]);

  // Smooth snap on scroll end
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(handleScroll, 80);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [handleScroll]);

  // Mouse drag support
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScroll.current = listRef.current?.scrollTop ?? 0;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !listRef.current) return;
    const delta = dragStartY.current - e.clientY;
    listRef.current.scrollTop = dragStartScroll.current + delta;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    handleScroll();
  }, [handleScroll]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const nudge = (dir: -1 | 1) => {
    const next = Math.max(0, Math.min(selectedIndex + dir, items.length - 1));
    onSelect(next);
    if (listRef.current) {
      listRef.current.scrollTo({ top: next * ITEM_HEIGHT, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
        flex: 1,
      }}
    >
      {/* Up arrow */}
      <button
        type="button"
        onClick={() => nudge(-1)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#8C6D4F',
          padding: '4px 8px',
          display: 'flex',
        }}
      >
        <ChevronUp size={16} />
      </button>

      {/* Scroll window */}
      <div
        style={{
          position: 'relative',
          height: ITEM_HEIGHT * VISIBLE_ITEMS,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Highlight band for selected item */}
        <div
          style={{
            position: 'absolute',
            top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
            left: 6,
            right: 6,
            height: ITEM_HEIGHT,
            background: '#F0EBE5',
            borderRadius: 8,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Fade top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: ITEM_HEIGHT * 1.5,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), transparent)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
        {/* Fade bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: ITEM_HEIGHT * 1.5,
            background: 'linear-gradient(to top, rgba(255,255,255,0.95), transparent)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Scrollable list */}
        <div
          ref={listRef}
          onMouseDown={handleMouseDown}
          style={{
            height: '100%',
            overflowY: 'scroll',
            scrollbarWidth: 'none',
            cursor: 'grab',
            position: 'relative',
            zIndex: 0,
          }}
        >
          {/* Padding top/bottom so first and last items can reach centre */}
          <div style={{ height: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }} />
          {items.map((val, i) => (
            <div
              key={val}
              onClick={() => {
                onSelect(i);
                if (listRef.current) {
                  listRef.current.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
                }
              }}
              style={{
                height: ITEM_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: i === selectedIndex ? 17 : 14,
                fontWeight: i === selectedIndex ? 700 : 400,
                fontFamily: 'var(--font-body)',
                color: i === selectedIndex ? '#1A1614' : '#8C6D4F',
                cursor: 'pointer',
                transition: 'font-size 0.15s, color 0.15s',
                letterSpacing: i === selectedIndex ? '0.01em' : '0',
              }}
            >
              {formatLabel(val)}
            </div>
          ))}
          <div style={{ height: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }} />
        </div>
      </div>

      {/* Down arrow */}
      <button
        type="button"
        onClick={() => nudge(1)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#8C6D4F',
          padding: '4px 8px',
          display: 'flex',
        }}
      >
        <ChevronDown size={16} />
      </button>
    </div>
  );
}

// ── Main Dropdown ─────────────────────────────────────────────────────────────
export default function DatePickerDropdown({
  value,
  onChange,
  onClose,
  anchorRef,
  min,
  max,
}: DatePickerDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse current value into day/month/year
  const parsed = value ? value.split('-') : null;
  const initYear = parsed ? parseInt(parsed[0]) : new Date().getFullYear() - 30;
  const initMonth = parsed ? parseInt(parsed[1]) : 1;
  const initDay = parsed ? parseInt(parsed[2]) : 1;

  // Build year range
  const minYear = min ? parseInt(min.split('-')[0]) : 1940;
  const maxYear = max ? parseInt(max.split('-')[0]) : new Date().getFullYear();
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  ).reverse(); // Most recent first

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [selYear, setSelYear] = useState(initYear);
  const [selMonth, setSelMonth] = useState(initMonth);
  const [selDay, setSelDay] = useState(initDay);

  // Days in selected month/year
  const daysInMonth = getDaysInMonth(selMonth, selYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Clamp day if it exceeds days in selected month
  useEffect(() => {
    if (selDay > daysInMonth) {
      setSelDay(daysInMonth);
    }
  }, [selMonth, selYear, daysInMonth, selDay]);

  // Emit ISO value whenever selection changes
  useEffect(() => {
    const iso = `${selYear}-${pad(selMonth)}-${pad(selDay)}`;
    onChange(iso);
  }, [selDay, selMonth, selYear]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    // Slight delay so the opening click doesn't immediately close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onClose, anchorRef]);

  // Indices
  const yearIndex = years.indexOf(selYear);
  const monthIndex = selMonth - 1;
  const dayIndex = selDay - 1;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        right: 0,
        background: '#FFFFFF',
        border: '1px solid rgba(26,22,20,0.15)',
        borderRadius: 14,
        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        zIndex: 500,
        padding: '8px 4px 12px',
        overflow: 'hidden',
      }}
    >
      {/* Column labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '0 8px 4px',
          borderBottom: '1px solid rgba(26,22,20,0.06)',
          marginBottom: 4,
        }}
      >
        {['Day', 'Month', 'Year'].map((label) => (
          <span
            key={label}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#8C6D4F',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Three columns */}
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Day */}
        <ScrollColumn
          items={days}
          selectedIndex={dayIndex}
          onSelect={(i) => setSelDay(days[i])}
          formatLabel={(v) => pad(v)}
        />

        {/* Divider */}
        <div style={{ width: 1, background: 'rgba(26,22,20,0.06)', margin: '8px 0' }} />

        {/* Month */}
        <ScrollColumn
          items={months}
          selectedIndex={monthIndex}
          onSelect={(i) => setSelMonth(months[i])}
          formatLabel={(v) => MONTHS[v - 1].slice(0, 3)}
        />

        {/* Divider */}
        <div style={{ width: 1, background: 'rgba(26,22,20,0.06)', margin: '8px 0' }} />

        {/* Year */}
        <ScrollColumn
          items={years}
          selectedIndex={yearIndex === -1 ? 0 : yearIndex}
          onSelect={(i) => setSelYear(years[i])}
          formatLabel={(v) => String(v)}
        />
      </div>

      {/* Done button */}
      <div style={{ padding: '8px 12px 0' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            background: '#1A1614',
            color: '#F7F5F2',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          Confirm Date
        </button>
      </div>
    </div>
  );
}
