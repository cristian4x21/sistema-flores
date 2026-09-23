/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        script: ['var(--font-caveat)', 'cursive', 'sans-serif'],
        brand: ['var(--font-quicksand)', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Paleta oficial de Loany Detalles (Inspirada en el cartel floral y girasoles)
        loany: {
          50: '#fffdf5',
          100: '#fef9c3', // Amarillo suave
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15', // Girasol vibrante
          500: '#f59e0b', // Miel dorada principal
          600: '#d97706', // Ámbar cálido
          700: '#b45309', // Caramelo
          800: '#854d0e', // Tostado
          900: '#713f12', // Café madera
          950: '#422006', // Café profundo texto Loany
        },
        // Toque floral rubor (de los tulipanes del ramo)
        tulipan: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
        }
      }
    },
  },
  plugins: [],
};
