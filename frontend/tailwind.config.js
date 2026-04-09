/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        midnight: '#0a0f1e',
        gold: {
          DEFAULT: '#c4a254',
          light: '#d4b264',
          dark: '#b49244',
        },
        eggshell: '#e8e4d8',
        saudi: {
          green: '#006633',
          light: '#00994d',
        }
      },
      fontFamily: {
        sans: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        display: ['var(--font-bebas)', 'cursive'],
        body: ['var(--font-sora)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
