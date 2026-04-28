import type { Config } from 'tailwindcss'

/**
 * Halo Design System v1.1 — Tailwind config.
 * Tokens canônicos vivem em :root via globals.css. Aqui apenas referenciamos
 * via var(--token) para que classes utility do Tailwind funcionem.
 *
 * Ver docs/reviews/halo-roundtable/HALO-DS-v1.1.md §11 para fonte oficial.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ===== HALO v1.1 — 5 ÂNCORAS ===== */
        'halo-black': 'var(--halo-black)',
        'halo-navy': {
          DEFAULT: 'var(--halo-navy)',
          90: 'var(--halo-navy-90)',
          80: 'var(--halo-navy-80)',
          60: 'var(--halo-navy-60)',
          40: 'var(--halo-navy-40)',
          20: 'var(--halo-navy-20)',
          10: 'var(--halo-navy-10)',
        },
        'halo-orange': {
          DEFAULT: 'var(--halo-orange)',
          100: 'var(--halo-orange-100)',
          90: 'var(--halo-orange-90)',
          80: 'var(--halo-orange-80)',
          30: 'var(--halo-orange-30)',
          15: 'var(--halo-orange-15)',
          '05': 'var(--halo-orange-05)',
        },
        'halo-gray': {
          DEFAULT: 'var(--halo-gray)',
          90: 'var(--halo-gray-90)',
          70: 'var(--halo-gray-70)',
          50: 'var(--halo-gray-50)',
          30: 'var(--halo-gray-30)',
          15: 'var(--halo-gray-15)',
          '05': 'var(--halo-gray-05)',
        },
        'halo-white': 'var(--halo-white)',

        /* ===== ALIASES SEMÂNTICOS (uso preferido em código) ===== */
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          inverse: 'var(--ink-inverse)',
        },
        paper: 'var(--bg)', // alias retrocompatível para canvas base
        line: {
          DEFAULT: 'var(--line)',
          soft: 'var(--line-soft)',
        },
        accent: 'var(--bg-accent)',
        eclipse: 'var(--bg-inverse)',
        canvas: 'var(--bg)',
        elevated: 'var(--bg-elevated)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-body)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
        '2xl': 'var(--r-2xl)',
        full: 'var(--r-pill)',
      },
      spacing: {
        's-1': 'var(--s-1)',
        's-2': 'var(--s-2)',
        's-3': 'var(--s-3)',
        's-4': 'var(--s-4)',
        's-5': 'var(--s-5)',
        's-6': 'var(--s-6)',
        's-7': 'var(--s-7)',
        's-8': 'var(--s-8)',
        's-9': 'var(--s-9)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        glow: 'var(--shadow-glow)',
      },
    },
  },
  plugins: [],
}

export default config
