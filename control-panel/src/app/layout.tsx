import { Metadata } from "next"
// Remove the font imports
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/Sidebar"
import { HeaderControls } from "@/components/HeaderControls"
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
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 pl-64">
              <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background px-6">
                <HeaderControls />
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
