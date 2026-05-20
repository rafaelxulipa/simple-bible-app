import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { TimeThemeInitializer } from '@/components/time-theme-initializer'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Bíblia Sagrada',
  description: 'A Bíblia Sagrada em português',
  generator: 'Next.js',
  applicationName: 'Bíblia Sagrada',
  authors: [{ name: 'Otávio Rafael', url: 'https://otaviorafae.com.br' }],
  keywords: ['Bíblia', 'Sagrada', 'Português', 'Versão'],
  creator: 'Otávio Rafael',
  publisher: 'Otávio Rafael',
  openGraph: {
    title: 'Bíblia Sagrada',
    description: 'A Bíblia Sagrada em português',
    url: 'https://bible.otaviorafael.com.br',
    siteName: 'Bíblia Sagrada',
    images: [
      {
        url: 'https://biblisagrada.or.app.br/bible-desktop.png',
        width: 1200,
        height: 630,
        alt: 'Bíblia Sagrada',
      },
      {
        url: 'https://biblisagrada.or.app.br/bible-responsive.png',
        width: 800,
        height: 600,
        alt: 'Bíblia Sagrada Mobile',
      },
    ],
    locale: 'pt-BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo192.png" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TimeThemeInitializer />
          {children}
        </ThemeProvider>
        <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js') }`,
          }}
        />
      </body>
    </html>
  )
}
