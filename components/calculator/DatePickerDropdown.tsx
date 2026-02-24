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

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5; // odd — selected item sits in centre slot

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

// ── Single scrollable drum column ────────────────────────────────────────────
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
  const isScrolling = useRef(false);

  // Scroll to selected item on mount and when selection changes externally
  useEffect(() => {
    if (listRef.current && !isDragging.current) {
      listRef.current.scrollTop = selectedIndex * ITEM_HEIGHT;
    }
  }, [selectedIndex]);

  // Determine which item is centred after scroll stops
  const snapToNearest = useCallback(() => {
    if (!listRef.current) return;
    const raw = listRef.current.scrollTop;
    const snapped = Math.round(raw / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(snapped, items.length - 1));
    // Smooth-scroll to exact snap position
    listRef.current.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' });
    if (clamped !== selectedIndex) {
      onSelect(clamped);
    }
  }, [items.length, onSelect, selectedIndex]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      isScrolling.current = true;
      clearTimeout(timer);
      timer = setTimeout(() => {
        isScrolling.current = false;
        if (!isDragging.current) snapToNearest();
      }, 100);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [snapToNearest]);

  // Mouse drag
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
    snapToNearest();
  }, [snapToNearest]);

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
    listRef.current?.scrollTo({ top: next * ITEM_HEIGHT, behavior: 'smooth' });
  };

  const centreOffset = Math.floor(VISIBLE_ITEMS / 2); // = 2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>

      {/* Up nudge */}
      <button
        type="button"
        onClick={() => nudge(-1)}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#8C6D4F', padding: '4px 8px', display: 'flex',
        }}
      >
        <ChevronUp size={16} />
      </button>

      {/* Drum window */}
      <div style={{
        position: 'relative',
        height: ITEM_HEIGHT * VISIBLE_ITEMS,
        width: '100%',
        overflow: 'hidden',
      }}>

        {/* ── Layer 0 (bottom): highlight band ── */}
        {/* Sits behind the scroll list — visible through transparent item backgrounds */}
        <div style={{
          position: 'absolute',
          top: ITEM_HEIGHT * centreOffset,
          left: 6,
          right: 6,
          height: ITEM_HEIGHT,
          background: '#F0EBE5',
          borderRadius: 10,
          zIndex: 0,
          pointerEvents: 'none',
        }} />

        {/* ── Layer 1 (middle): scrollable item list ── */}
        {/* background: transparent so highlight band shows through */}
        <div
          ref={listRef}
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            inset: 0,
            overflowY: 'scroll',
            scrollbarWidth: 'none',
            cursor: 'grab',
            zIndex: 1,           // above highlight band
            background: 'transparent',
          }}
        >
          {/* Top padding so first item can reach centre */}
          <div style={{ height: ITEM_HEIGHT * centreOffset }} />

          {items.map((val, i) => {
            const isSelected = i === selectedIndex;
            return (
              <div
                key={val}
                onClick={() => {
                  onSelect(i);
                  listRef.current?.scrollTo({ top: i * ITEM_HEIGHT, behavior: 'smooth' });
                }}
                style={{
                  height: ITEM_HEIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isSelected ? 17 : 14,
                  fontWeight: isSelected ? 700 : 400,
                  fontFamily: 'var(--font-body)',
                  color: isSelected ? '#1A1614' : '#B8A898',
                  cursor: 'pointer',
                  transition: 'font-size 0.15s, color 0.15s',
                  letterSpacing: isSelected ? '0.02em' : '0',
                  // Transparent background — lets highlight band show through
                  background: 'transparent',
                  userSelect: 'none',
                }}
              >
                {formatLabel(val)}
              </div>
            );
          })}

          {/* Bottom padding so last item can reach centre */}
          <div style={{ height: ITEM_HEIGHT * centreOffset }} />
        </div>

        {/* ── Layer 2 (top): fade overlays ── */}
        {/* pointer-events: none so clicks pass through to scroll list */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: ITEM_HEIGHT * centreOffset,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.0) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: ITEM_HEIGHT * centreOffset,
          background: 'linear-gradient(to top, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.0) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
      </div>

      {/* Down nudge */}
      <button
        type="button"
        onClick={() => nudge(1)}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#8C6D4F', padding: '4px 8px', display: 'flex',
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

  // Parse incoming value
  const parsed = value ? value.split('-') : null;
  const initYear  = parsed ? parseInt(parsed[0]) : new Date().getFullYear() - 30;
  const initMonth = parsed ? parseInt(parsed[1]) : 1;
  const initDay   = parsed ? parseInt(parsed[2]) : 1;

  // Year range — most recent first so scrolling down goes back in time
  const minYear = min ? parseInt(min.split('-')[0]) : 1940;
  const maxYear = max ? parseInt(max.split('-')[0]) : new Date().getFullYear();
  const years  = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).reverse();
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const [selYear,  setSelYear]  = useState(initYear);
  const [selMonth, setSelMonth] = useState(initMonth);
  const [selDay,   setSelDay]   = useState(initDay);

  // Clamp day when month/year changes
  const daysInMonth = getDaysInMonth(selMonth, selYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    if (selDay > daysInMonth) setSelDay(daysInMonth);
  }, [selMonth, selYear, daysInMonth, selDay]);

  // Emit ISO whenever selection changes
  useEffect(() => {
    const d = Math.min(selDay, daysInMonth);
    onChange(`${selYear}-${pad(selMonth)}-${pad(d)}`);
  }, [selDay, selMonth, selYear]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handler);
    };
  }, [onClose, anchorRef]);

  // Indices for each column
  const dayIndex   = selDay - 1;
  const monthIndex = selMonth - 1;
  const yearIndex  = years.indexOf(selYear) === -1 ? 0 : years.indexOf(selYear);

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
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0 8px 6px',
        borderBottom: '1px solid rgba(26,22,20,0.06)',
        marginBottom: 4,
      }}>
        {['Day', 'Month', 'Year'].map((label) => (
          <span key={label} style={{
            flex: 1, textAlign: 'center',
            fontSize: 10, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
          }}>
            {label}
          </span>
        ))}
      </div>

      {/* Three drum columns */}
      <div style={{ display: 'flex' }}>
        <ScrollColumn
          items={days}
          selectedIndex={dayIndex}
          onSelect={(i) => setSelDay(days[i])}
          formatLabel={(v) => pad(v)}
        />
        <div style={{ width: 1, background: 'rgba(26,22,20,0.07)', margin: '8px 0' }} />
        <ScrollColumn
          items={months}
          selectedIndex={monthIndex}
          onSelect={(i) => setSelMonth(months[i])}
          formatLabel={(v) => MONTHS[v - 1].slice(0, 3)}
        />
        <div style={{ width: 1, background: 'rgba(26,22,20,0.07)', margin: '8px 0' }} />
        <ScrollColumn
          items={years}
          selectedIndex={yearIndex}
          onSelect={(i) => setSelYear(years[i])}
          formatLabel={(v) => String(v)}
        />
      </div>

      {/* Confirm button */}
      <div style={{ padding: '8px 12px 0' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%', padding: '10px',
            background: '#1A1614', color: '#F7F5F2',
            border: 'none', borderRadius: 8,
            fontSize: 13, fontFamily: 'var(--font-body)',
            cursor: 'pointer', letterSpacing: '0.02em',
          }}
        >
          Confirm Date
        </button>
      </div>
    </div>
  );
}
