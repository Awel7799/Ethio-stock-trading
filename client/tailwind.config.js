// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      zIndex: {
        100: '100',
        'max': '1000',   // 🚀 super high z-index
      },
    },
  },
  plugins: [],
}
