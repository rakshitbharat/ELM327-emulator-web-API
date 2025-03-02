import { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/Sidebar"
import { ThemeToggle } from "@/components/ThemeToggle"
import "./globals.css"

export const metadata: Metadata = {
  title: "ECU Simulator",
  description: "Control and monitor ECU parameters through OBD-II commands",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 pl-64">
              <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-6">
                <div />
                <ThemeToggle />
              </header>
              <main className="container py-6">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
