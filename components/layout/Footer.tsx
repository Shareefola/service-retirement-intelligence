import Logo from '@/components/branding/Logo';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(26,22,20,0.1)',
        padding: '32px 24px',
        marginTop: 96,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <Logo size={20} />
        <p
          style={{
            fontSize: 12,
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.04em',
          }}
        >
          Exact Calendar Arithmetic · International Configuration · Institutional Grade
        </p>
        <p
          style={{
            fontSize: 12,
            color: '#B8A898',
            fontFamily: 'var(--font-mono)',
          }}
        >
          © {year} SRI Platform
        </p>
      </div>
    </footer>
  );
}
