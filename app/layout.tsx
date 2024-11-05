import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Armazenamento em Nuvem',
  description: 'Website para pesquisar painel Microsoft',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={'antialiased'}
      >
        {children}
      </body>
    </html>
  )
}
