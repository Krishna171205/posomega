import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Omega — The point of sale, perfected for restaurants.',
  description:
    'Omega is a modern point-of-sale platform built for restaurants, cafes, bars, and cloud kitchens.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
