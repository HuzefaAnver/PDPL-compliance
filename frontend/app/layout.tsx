import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'PDPL Shield — Check Your PDPL Compliance in 2 Minutes',
  description: 'Free PDPL compliance assessment for Saudi Arabia businesses. Get your Red/Amber/Green risk rating and AI action plan instantly.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-slate-950`}>
        <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
