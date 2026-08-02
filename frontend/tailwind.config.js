/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12151B",
        "ink-soft": "#1B1F27",
        paper: "#EDEAE1",
        compass: "#C9A227",
        "compass-dim": "#8A7226",
        slate: "#7C8493",
        teal: "#3E7C6C",
        rose: "#B4543A",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
