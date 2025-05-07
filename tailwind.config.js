import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/components/(autocomplete|avatar|breadcrumbs|button|card|divider|dropdown|image|input|link|modal|navbar|popover|select|skeleton|spinner|toggle|tabs|user|ripple|form|listbox|scroll-shadow|menu).js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        'pop-blob': {
          '0%': { transform: 'scale(1)' },
          '33%': { transform: 'scale(1.2)' },
          '66%': { transform: 'scale(0.8)' },
          '100%': { transform: 'scale(1)' },
        },
        colors: {
          filter: {
            'blur-20': 'blur(20px)',
            'blur-25': 'blur(25px)',
          },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [heroui()],
}
