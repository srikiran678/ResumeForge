/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        forge: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          light: '#ffffff',
          dark: '#121316',
          darker: '#08090a',
          elevated: '#1a1b20',
          active: '#22242b',
        }
      },
      borderColor: {
        hairline: {
          dark: 'rgba(255, 255, 255, 0.07)',
          light: 'rgba(15, 23, 42, 0.08)',
        }
      },
      boxShadow: {
        'glow-indigo': '0 0 20px -3px rgba(99, 102, 241, 0.25)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
        'card-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'modal-elevated': '0 12px 36px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        display: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
        resumeClassic: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        resumeCompact: ['Arial', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
        resumeModern: ['Inter', 'system-ui', 'sans-serif'],
        resumeAcademic: ['Times New Roman', 'Times', 'serif'],
        resumeHackathon: ['Consolas', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
