/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          "light-blue": "#bee2fd",
          "pastel-blue": "#adbdfe",
        },
        accent: {
          "purplish-blue": "#463dff",
          "marine-blue": "#012959",
          "strawberry-red": "#ed3547",
        },
        neutral: {
          "light-gray": "#d5d8e5",
          magnolia: "#eff5ff",
          alabaster: "#f9faff",
        },
      },
    },
  },
  plugins: [],
};
