import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Inter, Sora, Bebas_Neue } from 'next/font/google'
import './globals.css'

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' })

export const metadata: Metadata = {
  title: 'DataLoom — Evaluate Your PDPL Compliance Readiness',
  description: 'Precision PDPL compliance assessment for KSA businesses. Get your Red/Amber/Green risk rating and AI-powered action plan instantly.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${bebas.variable} font-sans antialiased`}>
        <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
