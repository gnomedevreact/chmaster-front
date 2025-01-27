/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#DA0C81',
          200: '#272727',
          300: '#6D6D6D',
          400: '#0F0F0F',
          500: '#3C3C3C',
          600: '#A0A0A0',
          white: '#FAFAFA',
        },
      },
    },
  },
  plugins: [],
};
