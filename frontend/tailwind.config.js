/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'blue-bg' : '#2A3439',
        'black-bg' : '#0C0C0C',
        'glod-color' : '#f9cb5e'
        //0078ae
      },
      fontFamily: {
        cursive: ['"Great Vibes"', 'cursive'],
      }
    },
  },
  plugins: [],
}

