/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#4285F4", // Google Blue
        "danger": "#EA4335",  // Google Red
        "warning": "#FBBC05", // Google Yellow
        "success": "#34A853", // Google Green
        "surface": "#FDFDFD",
        "surface-dark": "#E5E5E5",
        "on-surface": "#111111",
        "on-surface-variant": "#333333",
        "outline": "#000000",
      },
      boxShadow: {
        "brutal": "4px 4px 0px 0px rgba(0,0,0,1)",
        "brutal-sm": "2px 2px 0px 0px rgba(0,0,0,1)",
        "brutal-lg": "8px 8px 0px 0px rgba(0,0,0,1)",
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Plus Jakarta Sans", "sans-serif"],
        "body": ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
