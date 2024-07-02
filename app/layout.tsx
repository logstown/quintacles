import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import { Link } from '@nextui-org/link'
import clsx from 'clsx'

import { Providers } from './providers'

import { siteConfig } from '@/config/site'
import { fontSans } from '@/config/fonts'
import { Navbar } from '@/components/navbar/navbar'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import NextLink from 'next/link'
import { MailIcon, ScrollTextIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: {
    default: 'Quintacles',
    template: `%s - Quintacles`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang='en'>
      <head />
      <body
        className={clsx(
          'min-h-screen overflow-y-scroll font-sans antialiased dark:bg-background',
          fontSans.variable,
        )}
      >
        <Toaster />
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <div className='relative flex h-screen flex-col'>
            <Navbar />
            {/* <main className='container mx-auto max-w-7xl flex-grow px-6 pt-16'></main> */}
            <main className='dark:bg-gradient-radial flex-grow bg-[rgba(255,255,255,0.2)] bg-[url("/paper-1.png")] from-foreground-200 to-background px-4 py-16 bg-blend-lighten'>
              {children}
            </main>
            <footer className='flex w-full flex-wrap items-center justify-evenly gap-3 p-3'>
              <div className='whitespace-nowrap text-tiny sm:text-base'>
                © quintacles.com 2024
              </div>
              <div className='flex gap-8 sm:gap-20'>
                <Link
                  href='mailto:ljoecks@gmail.com'
                  as={NextLink}
                  className='text-sm text-foreground'
                >
                  <MailIcon size={20} className='mr-2 text-foreground-500' />
                  Contact
                </Link>
                <Link
                  href='/credits'
                  as={NextLink}
                  className='text-sm text-foreground'
                >
                  <ScrollTextIcon size={20} className='mr-2 text-foreground-500' />
                  Credits
                </Link>
              </div>
            </footer>
          </div>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
