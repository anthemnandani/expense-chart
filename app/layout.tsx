import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { AuthProvider } from "@/context/auth-context"
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Expense Tracking System",
  description: "Track your expenses easily and efficiently.",
  generator: "Next.js",
  icons: {
    icon: "https://res.cloudinary.com/dmyq2ymj9/image/upload/v1748410755/eujses1ippo5ybahpr8k.png",
    apple: "https://res.cloudinary.com/dmyq2ymj9/image/upload/v1748410755/eujses1ippo5ybahpr8k.png",
  },
  authors: [{ name: "Nandani Singh" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
           <GoogleOAuthProvider
        clientId={process.env.GOOGLE_CLIENT_ID || ""}
      >
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
           </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}