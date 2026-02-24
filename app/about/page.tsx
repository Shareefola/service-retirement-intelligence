import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — SRI Service Retirement Intelligence',
};

const SPECS = [
  ['Framework', 'Next.js 14 (App Router, RSC)'],
  ['Language', 'TypeScript — strict mode'],
  ['Date Engine', 'date-fns v3 · Exact calendar arithmetic'],
  ['State Management', 'Zustand with localStorage persistence'],
  ['Form Validation', 'React Hook Form + Zod schemas'],
  ['PDF Generation', 'jsPDF — client-side rendering'],
  ['Deployment Target', 'Vercel — global edge network'],
  ['Configuration', 'Nigeria · UK · USA · Custom (fully configurable)'],
  ['Architecture', 'Future-ready for multi-user RBAC via Supabase'],
  ['Accessibility', 'WCAG AA compliant · Semantic HTML · ARIA'],
];

export default function AboutPage() {
  return (
    <main
      style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '48px 24px 80px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 52 }}>
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
          About the Platform
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(34px, 5vw, 52px)',
            letterSpacing: '-0.03em',
            color: '#1A1614',
            lineHeight: 1.1,
          }}
        >
          Service Retirement
          <br />
          Intelligence
        </h1>
      </div>

      {/* Sections */}
      {[
        {
          label: 'Mission Statement',
          body: `Service Retirement Intelligence was developed to streamline retirement computation processes and eliminate administrative inaccuracies prevalent in institutional environments. The platform provides exact calendar-based determination of mandatory retirement dates, ensuring compliance with statutory frameworks across diverse regulatory jurisdictions.

The fundamental objective is to deliver a precise, configurable, and globally adaptable retirement computation platform for HR professionals, administrative units, and institutional systems worldwide — establishing a new standard for computational accuracy in civil service administration.`,
        },
        {
          label: 'Origin & Professional Context',
          body: `This platform was conceived during professional engagement with the Appointments, Promotions and Discipline Department of a tertiary institution, undertaken concurrently with academic training in Statistics at the University of Ibadan, Nigeria. The computational rigour inherent in statistical methodology directly informed the architectural principles underpinning the engine — precise, verifiable, and free of approximation.

Administrative practice revealed a persistent pattern of retirement date discrepancies attributable to informal computation methods, approximated month-lengths, and inconsistent application of regulatory provisions — particularly regarding Research Fellow status. Service Retirement Intelligence was designed expressly to resolve these institutional failure points.`,
        },
        {
          label: 'Computational Principles',
          body: `All calculations employ exact calendar arithmetic using successive-subtraction methodology: years are computed and subtracted, then months, then remaining days — producing exact year/month/day breakdowns without recourse to 30-day-month approximations or floating-point day-count divisions.

The Research Fellow provision is implemented as an absolute override — it supersedes all other retirement limits without exception, as mandated by institutional regulations. The dual-trigger detection mechanism correctly identifies which of the two standard limits (mandatory retirement age or service cap) applies first, and provides complete audit documentation including both comparator dates.`,
        },
        {
          label: 'International Design',
          body: `SRI is architected from the ground up for international deployment. Country profile presets for Nigeria, the United Kingdom, and the United States provide preconfigured statutory retirement parameters, while the Custom configuration option supports any institutional or jurisdictional framework globally.

All parameters — retirement age, service cap, Research Fellow retirement age, and the pre-cutoff service computation reference date — are fully configurable through the Settings interface, with local persistence across sessions. The architecture is Supabase-ready for future multi-user and cloud-sync deployment.`,
        },
      ].map((section) => (
        <section key={section.label} style={{ marginBottom: 44 }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#8C6D4F',
              fontFamily: 'var(--font-mono)',
              marginBottom: 16,
            }}
          >
            {section.label}
          </p>
          {section.body.split('\n\n').map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: 16,
                lineHeight: 1.82,
                color: '#2C2420',
                fontFamily: 'var(--font-body)',
                marginBottom: 18,
              }}
            >
              {para}
            </p>
          ))}
        </section>
      ))}

      <hr
        style={{
          border: 'none',
          borderTop: '1px solid rgba(26,22,20,0.1)',
          margin: '44px 0',
        }}
      />

      {/* Technical specifications */}
      <section>
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
            marginBottom: 20,
          }}
        >
          Technical Specification
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {SPECS.map(([key, val]) => (
              <tr
                key={key}
                style={{ borderBottom: '1px solid rgba(26,22,20,0.07)' }}
              >
                <td
                  style={{
                    padding: '11px 0',
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    color: '#8C6D4F',
                    letterSpacing: '0.06em',
                    width: '38%',
                    verticalAlign: 'top',
                  }}
                >
                  {key}
                </td>
                <td
                  style={{
                    padding: '11px 0 11px 16px',
                    fontSize: 14,
                    fontFamily: 'var(--font-body)',
                    color: '#1A1614',
                  }}
                >
                  {val}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Closing quote */}
      <div
        style={{
          background: '#1A1614',
          borderRadius: 16,
          padding: '32px 36px',
          marginTop: 52,
        }}
      >
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
            marginBottom: 14,
          }}
        >
          Institutional Purpose
        </p>
        <blockquote
          style={{
            fontSize: 16,
            color: '#D4C8BC',
            lineHeight: 1.82,
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            margin: 0,
            borderLeft: 'none',
          }}
        >
          "The objective is to deliver a precise, configurable, and globally
          adaptable retirement computation platform for HR professionals,
          administrative units, and institutional systems worldwide —
          establishing a new standard for computational accuracy in civil
          service administration."
        </blockquote>
      </div>
    </main>
  );
}
