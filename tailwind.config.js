/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        saffron: "#FF9933",
        maroon: "#800000",
        gold: "#FFD700",
        teal: "#00897B",
      },
      fontFamily: {
        heading: ["Tangerine", "Great Vibes", "serif"],
        body: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(255, 153, 51, 0.25)",
      },
      backgroundImage: {
        kolamPattern:
          "radial-gradient(rgba(255, 215, 0, 0.12) 1px, transparent 1px), radial-gradient(rgba(255, 215, 0, 0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        kolam: "24px 24px, 48px 48px",
      },
      backgroundPosition: {
        kolam: "0 0, 12px 12px",
      },
    },
  },
  plugins: [],
};


