import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SRI — Service Retirement Intelligence',
  description:
    'A precision retirement computation platform for HR professionals and administrative institutions. Exact calendar arithmetic. International configuration.',
  keywords: [
    'retirement calculator',
    'civil service retirement',
    'HR computation',
    'service length calculator',
  ],
  openGraph: {
    title: 'SRI — Service Retirement Intelligence',
    description: 'Exact calendar arithmetic for institutional retirement computation.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500&family=Lora:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
