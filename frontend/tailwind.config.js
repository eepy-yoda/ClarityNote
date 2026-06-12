/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clarity: {
          beige: '#F5F5DC',
          lightBeige: '#FDFBF7',
          lightBrown: '#D2B48C',
          brown: '#8B4513',
          darkBrown: '#5C4033',
          bg: '#FAF9F6',
          paper: '#FDFBF7',
          card: '#FFFFFF',
          text: '#2D2D2D',
          muted: '#71717A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
