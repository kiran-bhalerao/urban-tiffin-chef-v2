/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins_regular: ["poppins_regular"],
        poppins_medium: ["poppins_medium"],
        poppins_semibold: ["poppins_semibold"],
        poppins_bold: ["poppins_bold"],
        poppins_extra: ["poppins_extra"],
        poppins_black: ["poppins_black"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "#e5e7e8",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          DEFAULT: "#FFA922",
          ["light-gray"]: "#ABABAB",
          background: "#F6F6F6",
          text: "#2B2B2B",
          muted: "#9A9A9A",
          violet: "#9F56FD",
          gray: "#676767",
          "dark-gray": "#2D2D2D",
          red: "#D12D2D",
          green: "#00CC52",
        },
      },
    },
  },
  plugins: [],
  presets: [require("nativewind/preset")],
};
