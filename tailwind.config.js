/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design system tokens
        'bg': 'hsl(230 15% 95%)',
        'surface': 'hsl(0 0% 100%)',
        'primary': 'hsl(240 80% 60%)',
        'accent': 'hsl(170 70% 50%)',
        'text-primary': 'hsl(230 15% 20%)',
        'text-secondary': 'hsl(230 15% 35%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(230, 15%, 10%, 0.1)',
        'modal': '0 16px 48px hsla(230, 15%, 10%, 0.16)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      transitionTimingFunction: {
        'custom-ease': 'cubic-bezier(0.22,1,0.36,1)',
      },
      transitionDuration: {
        'base': '250ms',
        'fast': '150ms',
        'slow': '400ms',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.card': {
          '@apply bg-surface rounded-lg shadow-card p-6': {},
        },
        '.btn-primary': {
          '@apply inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.btn-secondary': {
          '@apply inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-text-primary rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.btn-icon': {
          '@apply inline-flex items-center justify-center p-2 bg-gray-100 text-text-primary rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.input-field': {
          '@apply block w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed': {},
        },
      })
    }
  ],
}

