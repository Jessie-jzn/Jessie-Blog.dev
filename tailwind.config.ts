/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      //   sm: { max: "430px" },
      //   // => @media (min-width: 640px and max-width: 767px) { ... }
      //   md: { min: "431px", max: "1023px" },
      //   lg: { min: "1024px", max: "1440px" },
      //   xl: { min: "1441px" },
      xs: {
        max: "430px",
      },
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
    },
    extend: {
      zIndex: {
        201: 201,
      },
      keyframes: {
        "wave-animation": {
          "0%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "music-bar-1": {
          "0%, 100%": { height: "0%" },
          "50%": { height: "70%" },
        },
        "music-bar-2": {
          "0%, 100%": { height: "50%" },
          "25%": { height: "0%" },
          "75%": { height: "100%" },
        },
        "music-bar-3": {
          "0%, 100%": { height: "70%" },
          "15%": { height: "100%" },
          "65%": { height: "0%" },
        },
        "music-bar-4": {
          "0%, 100%": { height: "50%" },
          "35.7%": { height: "0%" },
          "85.7%": { height: "70%" },
        },
      },
      animation: {
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wave: "wave-animation 2.5s linear infinite",
        "music-bar-1": "music-bar-1 .8s linear infinite",
        "music-bar-2": "music-bar-2 .8s linear infinite",
        "music-bar-3": "music-bar-3 .8s linear infinite",
        "music-bar-4": "music-bar-4 .8s linear infinite",
      },
      boxShadow: {
        nextjs: "0 8px 20px rgb(0,0,0,0.12)",
        "nextjs-dark": "0 8px 20px rgb(255,255,255,0.12)",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // "sort-first-img": "url('/img/footer-texture.png')",
      },
      spacing: {
        "9/16": "56.25%",
      },
      lineHeight: {
        11: "2.75rem",
        12: "3rem",
        13: "3.25rem",
        14: "3.5rem",
      },
      fontFamily: {
        sans: ["Outfit", ...fontFamily.sans],
      },
      colors: {
        primary: "#7aa2f7",
        sky: colors.sky,
        gray: colors.neutral,
        dark: "#1A1B26",
        spotify: "#1DB954",
        coral: "#EF596F",
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.700"),
            a: {
              color: theme("colors.primary"),
              "&:hover": {
                color: `${theme("colors.sky.600")} !important`,
              },
              code: { color: theme("colors.sky.400") },
            },
            h1: {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
              color: theme("colors.gray.900"),
            },
            h2: {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
              color: theme("colors.gray.900"),
            },
            h3: {
              fontWeight: "600",
              color: theme("colors.gray.900"),
            },
            "h4,h5,h6": {
              color: theme("colors.gray.900"),
            },
            pre: {
              backgroundColor: "#24283b",
            },
            code: {
              color: "#BB9AF7",
              backgroundColor: "#24283b",
              paddingLeft: "4px",
              paddingRight: "4px",
              paddingTop: "2px",
              paddingBottom: "2px",
              borderRadius: "0.25rem",
            },
            "code::before": {
              content: "none",
            },
            "code::after": {
              content: "none",
            },
            details: {
              backgroundColor: theme("colors.gray.100"),
              paddingLeft: "4px",
              paddingRight: "4px",
              paddingTop: "2px",
              paddingBottom: "2px",
              borderRadius: "0.25rem",
            },
            hr: { borderColor: theme("colors.gray.200") },
            "ol li::marker": {
              fontWeight: "600",
              color: theme("colors.gray.500"),
            },
            "ul li::marker": {
              backgroundColor: theme("colors.gray.500"),
            },
            strong: { color: theme("colors.gray.600") },
            blockquote: {
              color: theme("colors.gray.900"),
              borderLeftColor: theme("colors.gray.200"),
            },
          },
        },
        dark: {
          css: {
            color: theme("colors.gray.300"),
            a: {
              color: theme("colors.primary"),
              "&:hover": {
                color: `${theme("colors.sky.400")} !important`,
              },
              code: { color: theme("colors.sky.400") },
            },
            h1: {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
              color: theme("colors.gray.100"),
            },
            h2: {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
              color: theme("colors.gray.100"),
            },
            h3: {
              fontWeight: "600",
              color: theme("colors.gray.100"),
            },
            "h4,h5,h6": {
              color: theme("colors.gray.100"),
            },
            pre: {
              backgroundColor: "#24283b",
            },
            code: {
              backgroundColor: "#24283b",
            },
            details: {
              backgroundColor: theme("colors.gray.800"),
            },
            hr: { borderColor: theme("colors.gray.700") },
            "ol li::marker": {
              fontWeight: "600",
              color: theme("colors.gray.400"),
            },
            "ul li::marker": {
              backgroundColor: theme("colors.gray.400"),
            },
            strong: { color: theme("colors.gray.100") },
            thead: {
              th: {
                color: theme("colors.gray.100"),
              },
            },
            tbody: {
              tr: {
                borderBottomColor: theme("colors.gray.700"),
              },
            },
            blockquote: {
              color: theme("colors.gray.100"),
              borderLeftColor: theme("colors.gray.700"),
            },
          },
        },
        // green:{
        //   css:{

        //   }
        // }
      }),
    },
  },
  plugins: [],
};
