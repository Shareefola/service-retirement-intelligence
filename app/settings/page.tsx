import SettingsPanel from '@/components/settings/SettingsPanel';

export default function SettingsPage() {
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 40 }}>
        <p
          style={{
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#8C6D4F',
            fontFamily: 'var(--font-mono)',
            marginBottom: 12,
          }}
        >
          Configuration
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            letterSpacing: '-0.02em',
            color: '#1A1614',
            marginBottom: 8,
          }}
        >
          Settings
        </h1>
        <p
          style={{
            fontSize: 15,
            color: '#5C4A3A',
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
          }}
        >
          Configure retirement parameters for your jurisdiction or institution.
          Settings persist locally across sessions.
        </p>
      </div>

      <SettingsPanel />
    </main>
  );
}
