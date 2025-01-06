/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "brand-gradient": "linear-gradient(to right, var(--brand-gradient-left) 0%, var(--brand-gradient-right) 90%)",
      },
      colors: {
        "brand-gradient-left": "var(--brand-gradient-left)",
        "brand-gradient-right": "var(--brand-gradient-right)",
        "text-opposite": "var(--text-opposite)",
        secondary: "var(--secondary)",
        green: "var(--green)",
        orange: "var(--orange)",
        cyan: "var(--cyan)",
        "dark-blue": "rgba(var(--dark-blue))",
        "dark-dark-blue": "rgba(var(--dark-dark-blue))",
        black: "rgba(var(--black))",
        white: "rgba(var(--white))",
        text: "var(--text)",
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
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: "var(--accent)",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "var(--border)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
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
