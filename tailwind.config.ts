import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderRadius: { lg: '0.5rem', xl: '0.75rem', '2xl': '1rem' },
      boxShadow: { card: '0 10px 30px rgba(0,0,0,0.06)' }
    }
  },
  plugins: []
} satisfies Config
