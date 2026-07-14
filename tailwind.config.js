/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Layered deep-black backgrounds
        base: {
          900: "#030303",
          800: "#060606",
          700: "#0A0A0A",
          600: "#101010",
        },
        // Neon accents
        neon: {
          green: "#00FF88",
          lime: "#7CFF4F",
          cyan: "#00E5FF",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 12px rgba(0, 255, 136, 0.35), 0 0 2px rgba(0, 255, 136, 0.6)",
        "neon-lg":
          "0 0 30px rgba(0, 255, 136, 0.25), 0 0 8px rgba(0, 255, 136, 0.4)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 3.5s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
