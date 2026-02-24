import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        maxWidth: 560,
        margin: '120px auto',
        padding: '0 24px',
        textAlign: 'center',
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
        Error 404
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 48,
          letterSpacing: '-0.03em',
          color: '#1A1614',
          marginBottom: 16,
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          fontSize: 16,
          color: '#5C4A3A',
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          marginBottom: 32,
          lineHeight: 1.7,
        }}
      >
        The requested resource does not exist within the SRI platform.
        Perhaps you were looking for the calculator?
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          padding: '12px 28px',
          background: '#1A1614',
          color: '#F7F5F2',
          borderRadius: 10,
          fontSize: 14,
          fontFamily: 'var(--font-body)',
          textDecoration: 'none',
        }}
      >
        Return Home
      </Link>
    </main>
  );
}
