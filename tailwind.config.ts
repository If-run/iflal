import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        inkSoft: '#1E293B',
        paper: '#F7F9FA',
        card: '#FFFFFF',
        line: '#E4E9EC',
        muted: '#64748B',
        teal: {
          DEFAULT: '#0F766E',
          bright: '#14B8A6',
        },
        amber: '#D97706',
        danger: '#DC2626',
        success: '#16A34A',
      },
      borderRadius: {
        app: '14px',
      },
      boxShadow: {
        app: '0 1px 2px rgba(15,23,42,.06), 0 8px 24px -12px rgba(15,23,42,.18)',
      },
    },
  },
  plugins: [],
} satisfies Config;
