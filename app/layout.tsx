import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Power Gym App',
  description: 'Gym member workout tracking and analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
