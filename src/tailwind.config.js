
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      rotate: {
        'y-5': '5deg',
        'x-5': '5deg',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      perspective: {
        'none': 'none',
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [],
};
