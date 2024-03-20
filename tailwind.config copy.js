/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        instagram: "#E4405F",
        linkedin: "#0E76A8",
        github: "#24292E", // #2b3137 for lighter dark or #2dba4e for the green one
        soundcloud: "#FF7700",
      }
    },
  },
  
  plugins: [],
  darkMode: "class",
};
