/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f0faf4',
          100: '#D4EDDA',
          200: '#A8C5A0',
          300: '#7daa73',
          400: '#5a8f50',
          500: '#2D6A4F',
          600: '#235538',
          700: '#1B4332',
          800: '#112b1c',
          900: '#0D2B1F',
        },
        glow: {
          green: '#4ade80',
          sage: '#A8C5A0',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Nunito', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pond-ring': 'pond-ring-pulse 3.6s ease-out infinite',
        'pond-ring-2': 'pond-ring-pulse 3.6s ease-out infinite 1.8s',
        'water-glint': 'water-glint 8s ease-in-out infinite',
        'water-glint-2': 'water-glint 8s ease-in-out infinite 4s',
        'caustic': 'caustic-shift 10s ease-in-out infinite',
        'lily-sway': 'lily-sway 5.5s ease-in-out infinite',
        'duck-bob': 'duck-bob-gentle 3.2s ease-in-out infinite',
        'streak-pulse': 'streak-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.35s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.36,0.07,0.19,0.97) forwards',
        'ripple-out': 'ripple-out 1.5s ease-out forwards',
        'logo-shimmer': 'logo-shimmer 3.5s linear infinite',
        'bg-shift': 'bg-shift 16s ease infinite',
      },
    },
  },
  plugins: [],
};
