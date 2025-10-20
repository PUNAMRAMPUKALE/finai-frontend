// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand / Accent
        brand: {
          50:  '#F5F8FF',
          100: '#EAF0FF',
          200: '#D7E1FF',
          300: '#B9C8FF',
          400: '#90A6FF',
          500: '#5C79FF',  // primary
          600: '#415CF0',
          700: '#2E45CF',
          800: '#2437A3',
          900: '#1F2F82',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          50:  '#FBFBFD',
          100: '#F6F7FA',
          200: '#EFF1F5',
        },
        ink: {
          900: '#0B1020',
          700: '#1E2336',
          600: '#2A3150',
          500: '#3A4163',
          400: '#737A99',
        },
        border: 'hsl(220 15% 90%)',
        ring:   '#5C79FF',
        good:   '#17B26A',
        warn:   '#F79009',
        bad:    '#F04438',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card:  '0 8px 30px rgba(16,24,40,.06)',
        glow:  '0 0 0 6px rgba(92,121,255,.12)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
