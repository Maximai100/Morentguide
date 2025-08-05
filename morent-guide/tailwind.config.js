/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'morent-navy': '#0e2a3b',
        'morent-coral': '#ff8a95',
      },
      fontFamily: {
        'heading': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Inter', 'Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}