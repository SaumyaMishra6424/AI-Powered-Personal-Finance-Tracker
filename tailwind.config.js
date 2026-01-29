/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: "#0f172a",      // dark background
        cardBg: "#111827",         // main card
        cardBgSoft: "#1f2937",     // soft card/input bg
        textWhite: "#f9fafb",      // main text
        softGray: "#9ca3af",       // secondary text
        accentGreen: "#4ade80",    // neon green buttons
        accentGreenDark: "#22c55e" // hover green
      },
      borderRadius: {
        xl2: "1rem"
      }
    },
  },
  plugins: [],
};
