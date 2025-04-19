import type React from "react"
import { Figtree } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseProvider } from "@/lib/supabase-provider"

const figtree = Figtree({ subsets: ["latin"] })

export const metadata = {
  title: "you know me",
  description: "A bite-sized Q&A social app with a TikTok-style swipe feed",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={figtree.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SupabaseProvider>
            {children}
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
