/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'float-medium': 'float 10s ease-in-out infinite',
        'type-repeat': 'type 2.7s ease-out .8s infinite alternate both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        type: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '5%': { transform: 'translateX(0)', opacity: '1' },
          '95%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        }
      },
    },
  },
  plugins: [],
}