/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        flor: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d8',
          300: '#f4a8b7',
          400: '#ec738e',
          500: '#df436a',
          600: '#cb2753',
          700: '#ab1c41',
          800: '#8e1a38',
          900: '#781a33',
        }
      }
    },
  },
  plugins: [],
};
