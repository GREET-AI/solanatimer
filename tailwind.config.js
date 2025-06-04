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
        },
        "float": {
          "0%, 100%": { 
            transform: "translateY(0px) translateX(0px)",
            opacity: "0.3"
          },
          "50%": { 
            transform: "translateY(-20px) translateX(10px)",
            opacity: "0.6"
          }
        }
      },
      animation: {
        "led-flow": "led-flow 8s ease infinite",
        "led-pulse": "led-pulse 4s ease infinite",
        "gradient": "gradient 6s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 