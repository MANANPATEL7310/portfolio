/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Layered deep-black backgrounds
        base: {
          900: "#030303", // --bg-void
          800: "#060606",
          700: "#0A0A0A", // --bg-base
          600: "#101312", // --bg-elevated
        },
        // Neon accents
        neon: {
          green: "#00FF88", // --accent-primary
          lime: "#7CFF4F", // --accent-secondary
          cyan: "#00E5FF", // --accent-tertiary
        },
        // Premium text tokens
        content: {
          primary: "#F2F5F3", // --text-primary
          secondary: "#8B9C95", // --text-secondary
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
      // Modular type scale (1.25 ratio) — never arbitrary sizes
      fontSize: {
        "step-0": ["0.75rem", { lineHeight: "1.1rem" }], // 12
        "step-1": ["0.875rem", { lineHeight: "1.35rem" }], // 14
        "step-2": ["1rem", { lineHeight: "1.6rem" }], // 16
        "step-3": ["1.25rem", { lineHeight: "1.7rem" }], // 20
        "step-4": ["1.5625rem", { lineHeight: "1.9rem" }], // 25
        "step-5": ["1.9375rem", { lineHeight: "2.2rem" }], // 31
        "step-6": ["2.4375rem", { lineHeight: "2.6rem" }], // 39
        "step-7": ["3.0625rem", { lineHeight: "3.2rem" }], // 49
      },
      transitionTimingFunction: {
        entrance: "cubic-bezier(0.16, 1, 0.3, 1)", // expo-out
        hover: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      boxShadow: {
        neon: "0 0 12px rgba(0, 255, 136, 0.35), 0 0 2px rgba(0, 255, 136, 0.6)",
        "neon-lg":
          "0 0 30px rgba(0, 255, 136, 0.25), 0 0 8px rgba(0, 255, 136, 0.4)",
        // Layered elevation system (real depth, not flat box-shadow)
        "elev-1": "0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,255,136,0.18)",
        "elev-2":
          "0 4px 16px rgba(0,0,0,0.5), 0 0 24px rgba(0,255,136,0.06), 0 0 0 1px rgba(0,255,136,0.18)",
        "elev-3":
          "0 8px 32px rgba(0,0,0,0.6), 0 0 48px rgba(0,255,136,0.10), 0 0 0 1px rgba(0,255,136,0.45)",
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
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
