import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import { Link } from '@nextui-org/link'
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
          'min-h-screen overflow-y-scroll bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <Toaster />
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <div className='relative flex h-screen flex-col'>
            <Navbar />
            {/* <main className='container mx-auto max-w-7xl flex-grow px-6 pt-16'></main> */}
            <main className='flex-grow bg-gradient-radial from-foreground-200 to-background px-4 py-16'>
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
                  href='/feedback'
                  as={NextLink}
                  className='text-sm text-foreground'
                >
                  <MessageCircleIcon
                    size={20}
                    className='mr-2 text-foreground-500'
                  />
                  Feedback
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
          {modal}
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
