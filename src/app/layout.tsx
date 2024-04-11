import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import Toast from "ui/Toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Account Abstraction - Examples",
  description: "Implement account abstraction in your dapp with Biconomy.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-gray-900 ${inter.className}`}>
        <Toast />
        {children}
      </body>
    </html>
  )
}
