import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material 3 Expressive System Colors from Mockups
        surface: "#f9f9ff",
        "surface-dim": "#d7dae3",
        "surface-bright": "#f9f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f3fc",
        "surface-container": "#ebedf7",
        "surface-container-high": "#e6e8f1",
        "surface-container-highest": "#e0e2eb",
        "surface-variant": "#e0e2eb",
        "surface-tint": "#005db8",

        "on-surface": "#181c22",
        "on-surface-variant": "#414753",
        "inverse-surface": "#2d3037",
        "inverse-on-surface": "#eef0fa",

        outline: "#717785",
        "outline-variant": "#c1c6d5",

        primary: "#005cb8",
        "on-primary": "#ffffff",
        "primary-container": "#1275e2",
        "on-primary-container": "#ffffff",
        "inverse-primary": "#aac7ff",
        "primary-fixed": "#d6e3ff",
        "primary-fixed-dim": "#aac7ff",
        "on-primary-fixed": "#001b3e",
        "on-primary-fixed-variant": "#00458d",

        secondary: "#465f88",
        "on-secondary": "#ffffff",
        "secondary-container": "#b6d0ff",
        "on-secondary-container": "#3f5881",
        "secondary-fixed": "#d6e3ff",
        "secondary-fixed-dim": "#aec7f7",
        "on-secondary-fixed": "#001b3d",
        "on-secondary-fixed-variant": "#2d476f",

        tertiary: "#9a4600",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#c05900",
        "on-tertiary-container": "#0d0300",
        "tertiary-fixed": "#ffdbc9",
        "tertiary-fixed-dim": "#ffb68c",
        "on-tertiary-fixed": "#321200",
        "on-tertiary-fixed-variant": "#763400",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        background: "#f9f9ff",
        "on-background": "#181c22",

        // Empathetic Slate Teal & Sage Tonal Palette
        slate: {
          teal: "#28585e",
          "teal-dark": "#0a4146",
          "teal-light": "#cbecef",
          sage: "#567a68",
          "sage-light": "#d9e6dd",
          mauve: "#905e78",
          "mauve-light": "#fcdae8",
        },
      },
      spacing: {
        "space-2xs": "0.25rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.25rem",
        "space-xl": "1.5rem",
        "space-2xl": "2rem",
        "space-3xl": "2.5rem",
        "pwa-nav-height": "4.5rem",
        "pwa-fab-size": "3.5rem",
        "screen-edge-padding": "1rem",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["34px", { lineHeight: "42px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["26px", { lineHeight: "32px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-md": ["22px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "24px", letterSpacing: "-0.005em", fontWeight: "600" }],
        "title-md": ["16px", { lineHeight: "22px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "0.01em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0.015em", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "400" }],
        "label-lg": ["14px", { lineHeight: "18px", letterSpacing: "0.02em", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.03em", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" }],
        "currency-lg": ["28px", { lineHeight: "34px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "currency-md": ["18px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "600" }],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};

export default config;
