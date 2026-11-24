/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      colors: {
        ink: '#202a25',
        muted: '#747b73',
        paper: '#f8f8f6',
        forest: '#315b48',
        leaf: '#e7eee8',
        clay: '#c76e4a',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(32, 42, 37, 0.07)',
      },
    },
  },
  plugins: [],
};
