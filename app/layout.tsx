import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo192.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
