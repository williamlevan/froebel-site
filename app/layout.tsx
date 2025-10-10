import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import Footer from './components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Froebel Site',
  description: 'A Next.js application with App Router and serverless APIs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Footer />
      </body>
    </html>
  )
}