import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bíblia Sagrada',
  description: 'A Bíblia Sagrada em português',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
