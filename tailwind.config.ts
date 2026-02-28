import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        moonDust: {
          lavender: "#D3D3FF",
          purple: "#CEB5FF",
          sky: "#8EC1DE",
          blue: "#80A8FF",
        },
        dark: {
          DEFAULT: "#0f0f1a",
          card: "#1a1a2e",
          border: "#2a2a3e",
        },
      },
    },
  },
  plugins: [],
};
export default config;
