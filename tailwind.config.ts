import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bgLight: "#FFDDE9",
        navbar: "#FFF2DB",
        container: "#00879E",
        containerHeader: "#003092",
        card: "#FFAB5B"
      },
    },
  },
  plugins: [],
} satisfies Config;
