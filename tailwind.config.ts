import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'rainy-day': "var(--rainy-day)",
        'moss-green': "var(--moss-green)",
        'dusk-glow': "var(--dusk-glow)",
        'black-sand': "var(--black-sand)",
        'dawn-rays': "var(--dawn-rays)",
        'ocean-blue': "var(--ocean-blue)",
        'white-water': "var(--white-water)",
      },
      fontFamily: {
        lot: ['Lot', 'sans-serif'],
        josefin: ['Josefin Sans', 'sans-serif'],
        sans: ['Josefin Sans'],
      },
    },
  },
  plugins: [],
};
export default config;
