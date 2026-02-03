export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        rose: "#ff4d6d",
        soft: "#fff0f3",
        wine: "#590d22",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Poppins'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 30px rgba(255, 77, 109, 0.25)",
      },
    },
  },
  plugins: [],
};
