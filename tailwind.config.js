/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        background: ["#5C2DD5", "#7945FF"],
        pink: "#FD6687",
        yellow: "#FFCE67",
      },
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
      },
      borderColor: {
        purple: "#8158e8",
      },
    },
  },
  plugins: [],
};
