'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/branding/Logo';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/calculator', label: 'Calculator' },
  { href: '/settings', label: 'Settings' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(26,22,20,0.12)',
        background: 'rgba(247,245,242,0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          <Logo />
        </Link>

        <div style={{ display: 'flex', gap: 4 }}>
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: 'var(--font-body)',
                  textDecoration: 'none',
                  background: active ? '#1A1614' : 'transparent',
                  color: active ? '#F7F5F2' : '#1A1614',
                  transition: 'all 0.2s',
                  letterSpacing: '0.01em',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
