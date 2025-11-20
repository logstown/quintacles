import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import { Link } from '@heroui/link'
import clsx from 'clsx'

import { Providers } from './providers'
import { fontSans } from '@/config/fonts'
import { Navbar } from '@/components/navbar/navbar'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import NextLink from 'next/link'
import { MailIcon, MessageCircleIcon, ScrollTextIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: {
    default: 'Quintacles',
    template: `%s`,
  },
  description: 'Your top five movies, tv shows and more',
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

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang='en'>
      <head />
      <body
        className={clsx(
          'bg-background min-h-screen font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Toaster />
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <div className='relative flex h-screen flex-col'>
            <Navbar />
            {/* <main className='container mx-auto max-w-7xl grow px-6 pt-16'></main> */}
            <main className='bg-gradient-radial from-primary-50 light:to-secondary-50 grow px-4 py-16 dark:to-black'>
              {children}
            </main>
            <footer className='flex w-full flex-wrap items-center justify-evenly gap-3 p-3 dark:bg-neutral-900'>
              <div className='text-tiny whitespace-nowrap sm:text-base'>
                © quintacles.com 2025
              </div>
              <div className='flex gap-8 sm:gap-20'>
                <Link
                  href='mailto:ljoecks@gmail.com'
                  className='text-foreground text-sm'
                >
                  <MailIcon size={20} className='text-foreground-500 mr-2' />
                  Contact
                </Link>
                <Link href='/feedback' className='text-foreground text-sm'>
                  <MessageCircleIcon
                    size={20}
                    className='text-foreground-500 mr-2'
                  />
                  Feedback
                </Link>
                <Link href='/credits' className='text-foreground text-sm'>
                  <ScrollTextIcon size={20} className='text-foreground-500 mr-2' />
                  Credits
                </Link>
              </div>
            </footer>
          </div>
          {modal}
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
