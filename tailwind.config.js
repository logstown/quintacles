import { nextui } from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/components/(autocomplete|avatar|button|card|divider|dropdown|image|input|link|modal|navbar|popover|select|skeleton|spinner|toggle|tabs|ripple|listbox|scroll-shadow|menu).js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
}
