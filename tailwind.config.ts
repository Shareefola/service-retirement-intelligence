import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
      colors: {
        bg: '#F7F5F2',
        surface: '#FFFFFF',
        ink: '#1A1614',
        muted: '#5C4A3A',
        faint: '#8C6D4F',
        accent: '#8C6D4F',
        'accent-bg': '#FDF6EF',
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
