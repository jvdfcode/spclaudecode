import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Paleta de marca — tokens centrais */
        ink: {
          950: '#2d3277',
          900: '#1a1a1a',
          700: '#666666',
          500: '#8a8a8a',
        },
        paper: {
          50: '#ffffff',
          100: '#f5f5f5',
          200: '#e0e0e0',
        },
        gold: {
          300: '#fff17a',
          400: '#ffe600',
          500: '#d8c300',
        },
        profit: {
          500: '#0e9f6e',
          200: '#a7f3d0',
          50:  '#dff7eb',
        },
        warn: {
          500: '#c06b00',
          200: '#fde68a',
          50:  '#fff1d8',
        },
        loss: {
          500: '#d64545',
          200: '#fecaca',
          50:  '#ffe3e1',
        },
        /* Alias semânticos (preservados para retrocompatibilidade) */
        primary: {
          DEFAULT: '#2d3277',
          50:  '#eef0fb',
          100: '#cfd4ff',
          500: '#2d3277',
          600: '#232969',
          700: '#1a1f50',
        },
        viable:    '#0e9f6e',
        attention: '#c06b00',
        danger:    '#d64545',
      },
    },
  },
  plugins: [],
}

export default config
