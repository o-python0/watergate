/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "pulse-highlight": "pulseHighlight 1.8s infinite",
      },
      keyframes: {
        pulseHighlight: {
          "0%, 100%": {
            filter:
              "brightness(1.1) saturate(1.5) drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))",
          },
          "50%": {
            filter:
              "brightness(1) saturate(1) drop-shadow(0 0 2px rgba(16, 185, 129, 0.4))",
          },
        },
      },
    },
  },
  plugins: [],
};
