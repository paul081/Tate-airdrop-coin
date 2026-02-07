import type React from "react"
import type { Metadata } from "next"
import { Geist, Manrope } from "next/font/google"
import { SiteCaptchaGate } from "@/components/site-captcha-gate"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

export const metadata: Metadata = {
  title: "Blockchain Vault Protocol",
  description: "Secure cryptocurrency vault platform for wallet management",
  generator: "redwhalesdev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${manrope.variable} antialiased dark`}>
      <body>
        <SiteCaptchaGate>{children}</SiteCaptchaGate>
      </body>
    </html>
  )
}
