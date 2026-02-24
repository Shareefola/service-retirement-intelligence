import Link from 'next/link';
import { ArrowRight, Calendar, Shield, TrendingUp, Clock, Settings, Download } from 'lucide-react';

const FEATURES = [
  {
    icon: Calendar,
    title: 'Exact Calendar Logic',
    text: 'True year/month/day difference computation using successive-subtraction methodology — no 30-day-month approximations, ever.',
  },
  {
    icon: Shield,
    title: 'Research Fellow Override',
    text: 'Separate retirement regime for Research Fellows. Absolute rule override with configurable age threshold, overriding all service limits.',
  },
  {
    icon: TrendingUp,
    title: 'Dual Trigger Detection',
    text: 'Automatically determines whether age limit or service cap triggers retirement first, with complete audit documentation.',
  },
  {
    icon: Clock,
    title: 'Service Period Analysis',
    text: 'Computes service length to statutory cutoff date and total career service with exact year/month/day precision.',
  },
  {
    icon: Settings,
    title: 'International Configuration',
    text: 'Country presets for Nigeria, UK, and USA. Fully customisable for any institutional or regulatory environment.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    text: 'Generate professionally formatted retirement computation reports with branding, parameters, and legal-grade timestamp.',
  },
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          textAlign: 'center',
          padding: '96px 0 72px',
          borderBottom: '1px solid rgba(26,22,20,0.1)',
          marginBottom: 72,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#8C6D4F',
            marginBottom: 20,
            fontFamily: 'var(--font-mono)',
          }}
        >
          Institutional Retirement Intelligence
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(42px, 7vw, 72px)',
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
            marginBottom: 24,
            color: '#1A1614',
          }}
        >
          Compute. Verify.
          <br />
          Retire with Precision.
        </h1>
        <p
          style={{
            fontSize: 18,
            color: '#5C4A3A',
            maxWidth: 540,
            margin: '0 auto 40px',
            lineHeight: 1.65,
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
          }}
        >
          Exact calendar arithmetic for HR professionals and administrative
          institutions. Zero approximations. Institutional confidence.
        </p>
        <Link
          href="/calculator"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 32px',
            background: '#1A1614',
            color: '#F7F5F2',
            borderRadius: 10,
            fontSize: 15,
            fontFamily: 'var(--font-body)',
            textDecoration: 'none',
            letterSpacing: '0.01em',
            transition: 'opacity 0.2s',
          }}
        >
          Begin Calculation <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 72 }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
            marginBottom: 32,
          }}
        >
          How It Works
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 1,
            border: '1px solid rgba(26,22,20,0.1)',
            borderRadius: 16,
            overflow: 'hidden',
            background: 'rgba(26,22,20,0.1)',
          }}
        >
          {[
            { n: '01', title: 'Enter Employee Data', sub: 'DOB, DOA, Fellow status' },
            { n: '02', title: 'Engine Computes', sub: 'Exact calendar arithmetic' },
            { n: '03', title: 'Results Returned', sub: 'Date, trigger, service' },
            { n: '04', title: 'Export or Print', sub: 'Professional PDF report' },
          ].map((step) => (
            <div
              key={step.n}
              style={{
                background: '#FAFAF9',
                padding: '28px 24px',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: '#8C6D4F',
                  marginBottom: 10,
                  letterSpacing: '0.1em',
                }}
              >
                {step.n}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontFamily: 'var(--font-serif)',
                  color: '#1A1614',
                  marginBottom: 4,
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#8C6D4F',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {step.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature grid ─────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 80 }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
            marginBottom: 32,
          }}
        >
          Platform Capabilities
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="card"
              style={{
                padding: 28,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 20px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 1px 4px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04)';
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: '#F0EBE5',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  color: '#8C6D4F',
                }}
              >
                <Icon size={20} />
              </div>
              <h3
                style={{
                  fontSize: 16,
                  fontFamily: 'var(--font-serif)',
                  marginBottom: 8,
                  color: '#1A1614',
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: '#5C4A3A',
                  lineHeight: 1.65,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: '#1A1614',
          borderRadius: 20,
          padding: '56px 48px',
          textAlign: 'center',
          marginBottom: 0,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
            marginBottom: 16,
          }}
        >
          Ready to compute
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 36,
            color: '#F7F5F2',
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}
        >
          Eliminate Administrative Uncertainty
        </h2>
        <p
          style={{
            fontSize: 16,
            color: '#B8A898',
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            maxWidth: 440,
            margin: '0 auto 32px',
          }}
        >
          One tool. Exact results. Institutional confidence.
        </p>
        <Link
          href="/calculator"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 32px',
            background: '#F7F5F2',
            color: '#1A1614',
            borderRadius: 10,
            fontSize: 15,
            fontFamily: 'var(--font-body)',
            textDecoration: 'none',
          }}
        >
          Open Calculator <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
