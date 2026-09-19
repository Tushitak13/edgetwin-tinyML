/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F7F0DC',
          50: '#FCF9F0',
          100: '#F7F0DC',
          200: '#EFE5C5',
          300: '#E2D5AC',
          card: '#FDFBF4',
          surface: '#F4ECE0',
          muted: '#ECE2D0'
        },
        'soft-butter': '#FFE89A',
        'butter-yellow': '#F4D35E',
        'oat-cream': '#EDE2C5',
        'coffee-bean': '#3A2418',
        'deep-espresso': '#24150F',
        'muted-coffee': '#806B5A',
        'coffee-border': '#D8CBB2',
        coffee: {
          DEFAULT: '#3A2418',
          deep: '#24150F',
          console: '#1C100B',
          darkcard: '#291810',
          subtle: '#4F3526',
          muted: '#7A5B49',
          light: '#5B4132',
          border: 'rgba(58, 36, 24, 0.15)',
          ghost: 'rgba(58, 36, 24, 0.06)',
          card: '#FDFBF5'
        },
        butter: {
          DEFAULT: '#F4D35E',
          soft: '#FFE89A',
          light: '#FFF5D6',
          deep: '#E2BD44',
          dark: '#D8B841'
        },
        mint: {
          DEFAULT: '#D4EED8',
          text: '#1F6B34',
          dot: '#2BB656'
        },
        amber: {
          DEFAULT: '#FCE7C8',
          text: '#934F0C'
        },
        vermilion: {
          DEFAULT: '#FCD8CE',
          text: '#962A14',
          pill: '#E25B3E'
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        editorial: ['"Instrument Sans"', 'sans-serif']
      },
      boxShadow: {
        'card-subtle': '0 4px 20px -2px rgba(58, 36, 24, 0.05), 0 2px 6px -1px rgba(58, 36, 24, 0.03)',
        'card-elevated': '0 12px 32px -4px rgba(58, 36, 24, 0.12), 0 4px 12px -2px rgba(58, 36, 24, 0.05)',
        'butter-glow': '0 0 20px rgba(244, 211, 94, 0.45)',
        'warm-sm': '0 2px 4px rgba(58, 36, 24, 0.04), 0 1px 2px rgba(58, 36, 24, 0.06)',
        'warm': '0 8px 20px -4px rgba(58, 36, 24, 0.08), 0 2px 6px -1px rgba(58, 36, 24, 0.04)',
        'warm-lg': '0 16px 32px -8px rgba(58, 36, 24, 0.12), 0 4px 12px -2px rgba(58, 36, 24, 0.06)',
        'console-card': '0 12px 28px -6px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(244, 211, 94, 0.15)',
        'inner-track': 'inset 0 2px 4px rgba(58, 36, 24, 0.12)'
      }
    },
  },
  plugins: [],
}
