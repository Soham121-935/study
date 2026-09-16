/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f2f8fd',
          100: '#e3f0fa',
          200: '#bcd8ee',
          300: '#7dadd9',
          400: '#3f84c4',
          500: '#1d69aa',
          600: '#175488',
          700: '#123f68',
          800: '#0e3050',
          900: '#0a2540',
        },
        ink: '#12212f',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,37,64,0.06), 0 4px 14px rgba(10,37,64,0.06)',
      },
      maxWidth: {
        content: '58rem',
      },
    },
  },
  plugins: [],
}
