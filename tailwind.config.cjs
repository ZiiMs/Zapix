/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'rad-light': {
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
        'rad-black': {
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
        'rad-red': {
          900: '#620000',
          800: '#6F0505',
          700: '#7C0B0B',
          600: '#891212',
          500: '#961B1B',
          400: '#A32424',
          300: '#B02F2F',
          200: '#BC3B3B',
          100: '#C94848',
          50: '#D65656',
        },
      },
      keyframes: {
        roundedHover: {
          '0%': {
            borderRadius: '9999px',
          },
          '50%': {
            borderRadius: '24px',
          },
          '100%': {
            borderRadius: '16px',
          },
        },
        enter: {
          from: {
            opacity: 0,
            transform: 'scale(0.5)',
            transition: 'all 150ms',
          },
          to: {
            opacity: 100,
            transform: 'scale(1)',
            transition: 'all 150ms',
          },
        },
        blurBackdrop: {
          from: {
            opacity: 0,
            transition: 'all 150ms',
          },
          to: {
            opacity: '20',
            transition: 'all 150ms',
          },
        },
      },
      animation: {
        modelBackdrop: 'blurBackdrop 150ms linear 1 forwards',
        roundedOn: 'roundedHover 250ms linear 1 forwards',
        enter: 'enter 150ms linear 1 forwards',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};

