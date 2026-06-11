/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#050507",
        panel: "rgba(10, 10, 14, 0.7)",
        glow: "#3b82f6", // sleek electric blue
        glowSecondary: "#6366f1", // indigo accent
        metallic: "#cbd5e1",
        graphite: "#1e293b",
        darkest: "#030304",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glassGlow: "0 8px 32px 0 rgba(59, 130, 246, 0.15)",
        neon: "0 0 30px rgba(59, 130, 246, 0.25)",
        neonStrong: "0 0 45px rgba(59, 130, 246, 0.4)",
      },
      backgroundImage: {
        radialGlow: "radial-gradient(circle at center, rgba(59, 130, 246, 0.15), transparent 60%)",
        metallicGradient: "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 50%, #475569 100%)",
        darkGradient: "linear-gradient(180deg, #09090b 0%, #030304 100%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      }
    },
  },
  plugins: [],
};
