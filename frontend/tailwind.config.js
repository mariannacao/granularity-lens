/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'passage': '#E5E7EB',
        'sentence': '#F3F4F6',
        'proposition': '#DBEAFE',
      },
    },
  },
  plugins: [],
} 