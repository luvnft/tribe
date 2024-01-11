const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        noto: ['Noto Sans', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: '#598022',
        primary: {
          DEFAULT: '#183F00',
          100: '#fbfff0',
          200: '#ddeeba',
          300: '#c0e085',
          400: '#98c354',
          500: '#739f36',
          600: '#598022',
          700: '#44661b',
          800: '#2e5203',
          900: '#183f00',
        },
        gray: {
          900: '#1E1E1E',
          800: '#303030',
          700: '#454744',
          600: '#787878',
          500: '#8E8E8E',
          400: '#BCBCBC',
          300: '#D2D2D2',
          200: '#EDEDED',
          100: '#F9F9F9',
        },
        neutral: {
          100: '#f9f9f9',
          200: '#ededed',
          300: '#d2d2d2',
          400: '#bcbcbc',
          500: '#8e8e8e',
          600: '#787878',
          700: '#626262',
          800: '#4b4b4b',
          900: '#1e1e1e',
          white: '#fff',
        },
        red: {
          100: '#fff6f5',
          200: '#ffd7d6',
          300: '#db8784',
          400: '#c25b5b',
          500: '#9e3f3f',
          600: '#802226',
          700: '#661417',
          800: '#530707',
          900: '#400002',
        },
        blue: {
          100: '#f4f8ff',
          200: '#baceee',
          300: '#86a8e0',
          400: '#547fc3',
          500: '#365e9f',
          600: '#224680',
          700: '#1b3866',
          800: '#0a2653',
          900: '#001840',
        },
        yellow: {
          100: '#fffced',
          200: '#fcf3c4',
          300: '#ffe58f',
          400: '#ebbc3e',
          500: '#bd8c1a',
          600: '#8f6511',
          700: '#7a5008',
          800: '#593505',
          900: '#4e2c00',
        },
        text: {
          primary: '#1E1E1E',
          secondary: '#787878',
          tertiary: '#BCBCBC',
          placeholder: '#8E8E8E',
          inverse: '#FFFFFF',
          link: '#598022',
          inverseLink: '#C0E085',
          disabled: '#BCBCBC',
        },
        surface: {
          '01': '#F9F9F9',
          '01-accent': '#F2F2F2',
          '02': '#FFFFFF',
          '02-accent': '#EDEDED',
          '03': '#F7FAF5',
          '04': '#DDEEBA',
          inverse: '#1E1E1E',
        },
        border: {
          primary: '598022',
          '01': '#EDEDED',
          '02': '#D2D2D2',
          '03': '#787878',
        },
        overflay: {
          '01': 'rgba(30, 30, 30, 0.08)',
          '02': 'rgba(30, 30, 30, 0.35)',
        },
        conditional: {
          hover01: `rgba(30, 30, 30, 0.08)`,
          selected01: '#FBFFF0',
          selected02: '#C0E085',
        },
      },
      animation: {
        'overlay-show': 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'content-show': 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('selected', ['.selected &', '.selected&']);
    }),
  ],
};
