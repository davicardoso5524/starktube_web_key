import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        focus: "var(--focus)",
        primary: {
          DEFAULT: "rgba(var(--primary-rgb), <alpha-value>)",
          foreground: "var(--primary-foreground)",
          hover: "var(--primary-hover)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
      },
      borderRadius: {
        xl: "1rem",   // 16px
        lg: "0.75rem",// 12px
        md: "0.5rem", // 8px
        sm: "0.25rem", // 4px
      },
      boxShadow: {
        glow: "0 0 20px 0px rgba(var(--primary-rgb), 0.5)",
        "glow-sm": "0 0 10px 0px rgba(var(--primary-rgb), 0.3)",
      }
    },
  },
  plugins: [],
};
export default config;
