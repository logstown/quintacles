import {
  Besley,
  Black_Ops_One,
  Bree_Serif,
  Cardo,
  Chango,
  Cherry_Swash,
  Chicle,
  Cinzel,
  Copse,
  Crimson_Pro,
  Fira_Code as FontMono,
  Inter as FontSans,
  Galindo,
  Girassol,
  Leckerli_One,
  Lemon,
  Linden_Hill,
  Modak,
  Monoton,
  Montagu_Slab,
  Oregano,
  Radley,
  Shrikhand,
  Slabo_13px,
  Solway,
  Special_Elite,
  Tangerine,
  Trade_Winds,
  Young_Serif,
} from 'next/font/google'

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const fancy = Cherry_Swash({
  subsets: ['latin'],
  weight: '400',
})
