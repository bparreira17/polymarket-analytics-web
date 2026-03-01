import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0a0a0f",
            foreground: "#e4e4e7",
            primary: {
              50: "#e6f7ff",
              100: "#b3e0ff",
              200: "#80caff",
              300: "#4db3ff",
              400: "#1a9dff",
              500: "#0088ff",
              600: "#006dcc",
              700: "#005299",
              800: "#003666",
              900: "#001b33",
              DEFAULT: "#0088ff",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#17c964",
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#f31260",
              foreground: "#ffffff",
            },
            warning: {
              DEFAULT: "#f5a623",
              foreground: "#000000",
            },
          },
        },
        light: {
          colors: {
            background: "#ffffff",
            foreground: "#11181c",
            primary: {
              DEFAULT: "#0088ff",
              foreground: "#ffffff",
            },
          },
        },
      },
    }) as any, // HeroUI plugin uses Tailwind v4 types internally
  ],
};
export default config;
