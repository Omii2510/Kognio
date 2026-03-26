/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5a67ff",
        background: "#f5f6fa",
        card: "#ffffff",
        text: "#1f2937",
        subtext: "#6b7280"
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.06)"
      },
      borderRadius: {
        xl2: "20px"
      }
    }
  },
  plugins: []
}