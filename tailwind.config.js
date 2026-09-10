/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#FAFAFA',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#CCCCCC',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#3D3D3D',
          800: '#262626',
          900: '#171717',
          950: '#0D0D0D',
        },
        signal: {
          teal: '#1F3D2E',
          amber: '#B7791F',
          rust: '#B3452B',
          slate: '#737373',
          indigo: '#6B5844',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
