import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Chatbot } from "@/components/chatbot"
import { DeploymentStatus } from "@/components/deployment-status"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PropertyHub - Find Your Dream Property",
  description:
    "Discover, buy, sell, and rent properties with ease. Your trusted real estate platform with government-certified data.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Chatbot />
          {process.env.NODE_ENV === "production" && <DeploymentStatus />}
        </ThemeProvider>
      </body>
    </html>
  )
}
