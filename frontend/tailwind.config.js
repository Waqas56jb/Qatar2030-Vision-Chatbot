/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffef9',
          100: '#fffdf3',
          200: '#fffbe7',
          300: '#fff9db',
          400: '#fef7cf',
          500: '#FCDE90',
          600: '#f5d070',
          700: '#ecc250',
          800: '#d4a830',
          900: '#b88e10',
        },
        accent: {
          white: '#FFFFFF',
          black: '#000000',
          gold: '#FCDE90',
        },
      },
    },
  },
  plugins: [],
}
