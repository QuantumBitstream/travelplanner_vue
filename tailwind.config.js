/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",  // 扫描 src 目录下所有的模板文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

