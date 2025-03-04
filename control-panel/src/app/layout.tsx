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
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1">
                <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background px-6">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="md:hidden" />
                    <HeaderControls />
                  </div>
                </header>
                <main className="p-6">
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
