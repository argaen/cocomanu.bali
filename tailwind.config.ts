import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-out': 'fade-in-out 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in-out': {
          '0%': { opacity: '0' },        // All notes are invisible initially
          '10%, 30%': { opacity: '1' },  // Fade-in effect
          '80%, 100%': { opacity: '0' },
        },
      },
      colors: {
        'dusk-glow': {
          100: '#9D4322',
          200: '#C77743',
          300: '#F2C09B',
        },
        'moss-green': {
          100: '#565A27',
          200: '#928E43',
          300: '#C4C2A2',
        },
        'ocean-blue': {
          100: '#045D5E',
          200: '#6C9396',
          300: '#B3C2C2',
        },
        'dawn-rays': {
          100: '#BF8A05',
          200: '#D6AC42',
          300: '#D6AC42',
        },
        'rainy-day': "var(--rainy-day)",
        'white-water': "var(--white-water)",
        'black-sand': "var(--black-sand)",
      },
      fontFamily: {
        lot: ['Lot', 'sans-serif'],
        josefin: ['Josefin Sans', 'sans-serif'],
        yeserva: ['Yeserva One', 'sans-serif'],
        sans: ['Josefin Sans'],
      },
    },
  },
  plugins: [
    require('tailwindcss-animated'),
    require('tailwindcss-intersect'),
  ],
};
export default config;
