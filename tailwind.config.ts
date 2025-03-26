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
        navbar: "#C5D3E8",
        container: "#F8FAFC",
        containerHeader: "#BCCCDC",
        card: "#D9EAFD"
      },
    },
  },
  plugins: [],
} satisfies Config;
