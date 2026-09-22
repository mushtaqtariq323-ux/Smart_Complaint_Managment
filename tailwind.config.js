/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 30px -14px rgba(0,0,0,0.14)',
        'glow-emerald': '0 0 44px -12px rgba(16,185,129,0.5)',
        'glow-lime': '0 8px 34px -12px rgba(163,230,53,0.55)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': { '0%': { opacity: '0', transform: 'scale(.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        'slide-left': { '0%': { opacity: '0', transform: 'translateX(24px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'pulse-soft': { '0%,100%': { opacity: '1' }, '50%': { opacity: '.55' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'bounce-dot': { '0%,80%,100%': { transform: 'translateY(0)' }, '40%': { transform: 'translateY(-5px)' } },
      },
      animation: {
        'fade-up': 'fade-up .55s cubic-bezier(.21,.61,.35,1) both',
        'fade-in': 'fade-in .4s ease both',
        'scale-in': 'scale-in .22s ease both',
        'slide-left': 'slide-left .4s cubic-bezier(.21,.61,.35,1) both',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.2s ease-in-out infinite',
        'bounce-dot': 'bounce-dot 1.2s infinite',
      },
    },
  },
  plugins: [],
}
