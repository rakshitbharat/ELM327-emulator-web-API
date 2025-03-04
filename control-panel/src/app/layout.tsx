import { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/Sidebar"
import { HeaderControls } from "@/components/HeaderControls"
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar"
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
      <body className="font-sans antialiased bg-background text-foreground overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SidebarProvider>
            <div className="flex min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
              <Sidebar />
              <div className="flex-1">
                <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="container flex h-16 max-w-screen-2xl items-center px-4">
                    <div className="flex items-center justify-between w-full gap-4">
                      <div className="flex items-center gap-4">
                        <SidebarTrigger className="md:hidden" />
                      </div>
                      <HeaderControls />
                    </div>
                  </div>
                </header>
                <main className="relative min-h-[calc(100vh-4rem)]">
                  {children}
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
