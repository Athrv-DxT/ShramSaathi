/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          900: '#0F6E56',
        },
        offwhite: '#F5F5F0',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
