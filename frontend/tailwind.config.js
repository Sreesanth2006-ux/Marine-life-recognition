/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ocean: {
          50:  '#caf0f8',
          100: '#ade8f4',
          200: '#90e0ef',
          300: '#48cae4',
          400: '#00b4d8',
          500: '#0096c7',
          600: '#0077b6',
          700: '#023e8a',
          800: '#03045e',
          900: '#020136',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        wave: 'wave 8s ease-in-out infinite',
        wave2: 'wave 10s ease-in-out infinite reverse',
        float: 'float 6s ease-in-out infinite',
        bubble: 'bubble 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-30px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '0.5' },
          '100%': { transform: 'translateY(-10vh) scale(1)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
