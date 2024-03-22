/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-gold': '#e5ab50',
        'secondary-color': '#312923',
        'bg-color': '#1b1b1b'
      },
    },
  },
  plugins: [],
}
