import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'

export default defineConfig({
  darkMode: 'class',
  extract: {
    include: ['src/**/*.{vue,html,jsx,tsx}'],
    exclude: ['node_modules', '.git', 'dist']
  },
  theme: {
    extend: {
      colors: {
        // Ensure all the colors used in your app are defined here
        cyan: colors.cyan,
        emerald: colors.emerald,
        slate: colors.slate,
        yellow: colors.yellow,
        red: colors.red,
        blue: colors.blue,
      },
      backgroundImage: {
        'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
    },
  },
  shortcuts: {
    // Define shortcuts for commonly used class combinations
    'feature-card': 'bg-gradient-to-b from-slate-800/80 to-cyan-950/80 p-6 rounded-lg border border-cyan-900/30 backdrop-blur-sm',
    'feature-icon': 'w-12 h-12 text-emerald-400',
    'feature-title': 'text-xl font-bold text-center mb-4 text-cyan-100',
    'feature-description': 'text-cyan-200/70',
    'cta-button': 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors',
    'nav-link': 'px-6 py-3 text-cyan-100 hover:bg-cyan-900/50 transition-colors',
    'nav-dropdown-link': 'px-8 py-2 text-cyan-100 hover:bg-cyan-900/50 transition-colors block',
  }
})
