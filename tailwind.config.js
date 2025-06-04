/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'solana-purple': '#9945FF',
        'solana-green': '#14F195',
      },
      keyframes: {
        "led-flow": {
          "0%, 100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" }
        },
        "led-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "translateY(-100%)" },
          "50%": { opacity: "1", transform: "translateY(100%)" }
        }
      },
      animation: {
        "led-flow": "led-flow 8s ease infinite",
        "led-pulse": "led-pulse 4s ease infinite",
        "gradient": "gradient 6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 