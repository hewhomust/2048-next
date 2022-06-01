module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brown-100": "#776E65",
        "brown-200": "#BBADA0",
      },
    },
  },
  plugins: [require("tailwindcss-elevation")(["responsive"])],
}
