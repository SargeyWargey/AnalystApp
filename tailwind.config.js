/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter Variable', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f3ff',
          500: '#8b5cf6',
          900: '#2D1B4E',
          950: '#1A0E2E',
        }
      }
    },
  },
  plugins: [],
}