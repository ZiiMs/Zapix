/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'main-light': {
          900: '#3F3F3F',
          800: '#545454',
          700: '#6A6A6A',
          600: '#7F7F7F',
          500: '#949494',
          400: '#AAAAAA',
          300: '#BFBFBF',
          200: '#D4D4D4',
          100: '#EAEAEA',
          50: '#FFFFFF',
        },
        'main-black': {
          900: '#131313',
          800: '#181818',
          700: '#1E1E1E',
          600: '#232323',
          500: '#292929',
          400: '#2E2E2E',
          300: '#343434',
          200: '#393939',
          100: '#3F3F3F',
          50: '#444444',
        },
      },
    },
  },
  plugins: [],
};

