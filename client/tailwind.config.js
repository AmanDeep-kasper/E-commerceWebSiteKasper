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
        // nova: ["Ibarra Real Nova", "serif"],
        // inter: ["Inter"],
        // playfair: ["Playfair Display"],
        // poppins: ['Poppins', 'sans-serif'],
        // montserrat: ['Montserrat', 'sans-serif'],
      },
      screens: {
        xs: "393px",
        xl: "1440px", // now lg starts at 1023px
      },
    },
  },

  plugins: [mtConfig],
};
