/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0a0e1a',
        card: '#111520',
        gold: '#F5C518',
        'border-base': '#1c1e2a',
        'border-dark': '#16181f',
        muted: '#555',
        dim: '#444',
      },
      fontFamily: {
        sans: ['"Arial Black"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
