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
        primary: {
          DEFAULT: '#1e3a5f',
          50: '#e8eef5',
          100: '#c5d4e7',
          500: '#1e3a5f',
          600: '#172d4a',
          700: '#102036',
        },
        viable: '#16a34a',
        attention: '#ca8a04',
        danger: '#dc2626',
      },
    },
  },
  plugins: [],
}

export default config
