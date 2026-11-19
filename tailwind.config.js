/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,md}'],
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      backgroundColor: {
        base: '#050505',
      },
      colors: {
        obsidian: '#050505',
        ink: {
          950: '#000000',
          900: '#050505',
          800: '#0a0a0a',
          700: '#111111',
          600: '#1a1a1a',
          500: '#262626',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F5C84C',
          deep: '#B8862B',
          50: '#FBF3D9',
        },
        amber: { DEFAULT: '#FFB000' },
        fire: { DEFAULT: '#FF5A1F', deep: '#E0430B' },
        glass: 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        display: [
          '"Space Grotesk Variable"',
          '"Space Grotesk Fallback"',
          'system-ui',
          'sans-serif',
        ],
        sans: [
          '"Inter Variable"',
          '"Inter Fallback"',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5C84C 0%, #D4AF37 50%, #B8862B 100%)',
        'fire-gradient': 'linear-gradient(135deg, #FFB000 0%, #FF5A1F 100%)',
        'gold-hairline': 'linear-gradient(90deg, transparent, rgba(212,175,55,.7), transparent)',
      },
      boxShadow: {
        'gold-glow': '0 0 0 1px rgba(212,175,55,.35), 0 10px 40px -10px rgba(212,175,55,.45)',
        'fire-glow': '0 10px 40px -8px rgba(255,90,31,.6), 0 0 0 1px rgba(255,176,0,.35)',
        glass: 'inset 0 1px 0 rgba(255,255,255,.06), 0 20px 60px -20px rgba(0,0,0,.8)',
      },
      letterSpacing: { luxe: '0.32em' },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
