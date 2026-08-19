/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: "#F3EFE4",
        olive: "#8B9A6A",
        ink: "#070707",
      },
    },
  },
  plugins: [],
};
