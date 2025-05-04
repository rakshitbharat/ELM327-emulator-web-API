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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // This is the correct way in App Router
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        <HeaderControls />
        {children}
      </body>
    </html>
  )
}
