import { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/Sidebar"
import { HeaderControls } from "@/components/HeaderControls"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SidebarProvider>
            <div className="flex h-screen overflow-hidden">
              {/* Sidebar */}
              <Sidebar className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 z-50" />
              
              {/* Main Content */}
              <div className="flex flex-col flex-1 w-full md:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="flex h-16 items-center px-4">
                    <SidebarTrigger className="md:hidden mr-4" />
                    <HeaderControls />
                  </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                  <div className="container mx-auto p-6">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
