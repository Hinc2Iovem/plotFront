/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgba(var(--primary))",
        "primary-darker": "rgba(var(--primary-darker))",
        secondary: "rgba(var(--secondary))",
        "secondary-darker": "rgba(var(--secondary-darker))",

        "dark-blue": "rgba(var(--dark-blue))",
        "dark-dark-blue": "rgba(var(--dark-dark-blue))",

        black: "rgba(var(--black))",
        white: "rgba(var(--white))",

        "text-light": "rgba(var(--text-light))",
        "text-dark": "rgba(var(--text-dark))",

        "light-gray": "rgba(var(--light-gray))",
        "lightest-gray": "rgba(var(--lightest-gray))",
        "second-lightest-gray": "rgba(var(--second-lightest-gray))",
        "dark-mid-gray": "rgba(var(--dark-mid-gray))",

        "green-light": "rgba(var(--green-light))",
        "green-mid-light": "rgba(var(--green-mid-light))",
        "green-mid": "rgba(var(--green-mid))",

        "red-light": "rgba(var(--red-light))",
        "red-mid-light": "rgba(var(--red-mid-light))",
        "red-mid": "rgba(var(--red-mid))",

        "orange-light": "rgba(var(--orange-light))",
        "orange-mid-light": "rgba(var(--orange-mid-light))",
        "orange-mid": "rgba(var(--orange-mid))",

        "lightest-yellow": "rgba(var(--lightest-yellow))",
      },
    },
  },
  plugins: [],
};

// primary: {
//   "light-blue": "#bee2fd",
//   "pastel-blue": "#adbdfe",
// },
// accent: {
//   "purplish-blue": "#463dff",
//   "marine-blue": "#012959",
//   "strawberry-red": "#ed3547",
// },
// neutral: {
//   "light-gray": "#d5d8e5",
//   magnolia: "#eff5ff",
//   alabaster: "#f9faff",
// },
