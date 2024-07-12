import {
  Athiti,
  Fira_Code as FontMono,
  Inter as FontSans,
  Nunito,
} from 'next/font/google'

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const bigFont = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
})

export const smallFont = Athiti({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-trykker',
})
