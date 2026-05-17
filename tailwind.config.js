/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: "#f0fdf4",
          100: "#dcfce7",
          800: "#047857",
        },
        lime: {
          100: "#dcfce7",
        },
        slate: {
          900: "#0f172a",
        },
        green: {
          100: "#dcfce7",
        },
      },
    },
  },
  plugins: [],
};
