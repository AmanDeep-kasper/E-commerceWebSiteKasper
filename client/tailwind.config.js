import { mtConfig } from "@material-tailwind/react";

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}",

    "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        montez: ["Montez", "cursive"],
        inter: ["Inter", "sans-serif"],
        marcellus: ["'Marcellus SC'", "cursive"],
      },
      screens: {
        xs: "393px",
        xl: "1440px", // now lg starts at 1023px
      },
    },
  },

  plugins: [mtConfig],
};
