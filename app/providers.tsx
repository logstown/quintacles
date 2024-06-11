'use client'

import * as React from 'react'
import { NextUIProvider } from '@nextui-org/system'
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query'

export interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter()
  const queryClient = getQueryClient()

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
