import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-void': '#0F0F12',
        'charcoal': '#1A1A1D',
        'quantum-ember': '#7B29B8',
        'radiant-magenta': '#C129A0',
        'stabilizer-cyan': '#29B8B0',
        'text-primary': '#FFFFFF',
        'text-secondary': '#FFFFFF33',
      },
      fontFamily: {
        mono: ['Space Mono', 'Fragment Mono', 'DM Mono', 'monospace'],
        sans: ['Inter', 'Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;