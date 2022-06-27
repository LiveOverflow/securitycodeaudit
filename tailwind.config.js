/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    aspectRatio: {
      none: 0,
      square: [1, 1],
      "16/9": [16, 9],
      "4/3": [4, 3],
      "21/9": [21, 9],
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
    },
    extend: {
      screens: {
        fixmobile: { raw: "(hover: hover)" },
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",

      black: "#131A21",
      blacker: "#000000",
      white: "#ffffff",

      red: "#DD4B21",
      green: "#16c1a2",

      yellow: "#D8AD66",
      purple: "#681FC4",
      blue: "#0EC7F0",
      orange: "#FF8A00",
      pink: "#DC2CEC",

      light: "#f5f5f9",

      dark: "#1f2129",
      darker: "#151519",
    },
    extend: {},
  },
  plugins: [],
};
