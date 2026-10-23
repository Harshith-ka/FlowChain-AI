/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080D19",
        surface: {
          DEFAULT: "#111827",
          secondary: "#111827",
          elevated: "#1B2435",
          highlight: "#26334D",
        },
        brand: {
          blue: "#3B82F6",
          light: "#60A5FA",
          dark: "#1D4ED8",
        },
        accent: {
          cyan: "#06B6D4",
          teal: "#14B8A6",
        },
        status: {
          green: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
          purple: "#A855F7",
        },
        text: {
          primary: "#F8FAFC",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.08)",
          DEFAULT: "rgba(255, 255, 255, 0.12)",
          active: "#3B82F6",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(59, 130, 246, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
