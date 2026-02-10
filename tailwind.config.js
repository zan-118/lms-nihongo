import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Masukkan konfigurasi font, warna, dan shadow kamu di sini
      colors: {
        bodyColor: "#1f242d",
        lightText: "#c4cfde",
        // dan seterusnya...
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    // tambahkan plugin lain jika ada
  ],
};

export default config;