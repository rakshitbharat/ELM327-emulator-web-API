import Link from "next/link";
import { 
  Gauge, 
  Github, 
  BookOpen, 
  FileText, 
  Network, 
  Settings, 
  HelpCircle,
  Code,
  Terminal,
  History,
  BookMarked
} from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarItems = [
  {
    title: "Dashboard",
    icon: Gauge,
    href: "/",
    description: "Monitor ECU parameters in real-time"
  },
  {
    title: "GitHub Repository",
    icon: Github,
    href: "https://github.com/rakshitbharat/ELM327-emulator-web-API",
    description: "View source code and contribute"
  },
  {
    title: "Documentation",
    icon: BookOpen,
    href: "/docs",
    description: "Read the project documentation"
  },
  {
    title: "API Reference",
    icon: Code,
    href: "/api-docs",
    description: "Browse API endpoints and schemas"
  },
  {
    title: "Protocol Guide",
    icon: Network,
    href: "/protocols",
    description: "Learn about OBD-II protocols"
  },
  {
    title: "Command Console",
    icon: Terminal,
    href: "/console",
    description: "Send custom OBD-II commands"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    description: "Configure emulator settings"
  },
  {
    title: "Command History",
    icon: History,
    href: "/history",
    description: "View past commands and responses"
  },
  {
    title: "Quick Start Guide",
    icon: BookMarked,
    href: "/quick-start",
    description: "Get started with the emulator"
  },
  {
    title: "Support",
    icon: HelpCircle,
    href: "/support",
    description: "Get help and support"
  }
];

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-lg font-semibold">ELM327 Emulator</span>
        </Link>
      </div>
      
      <nav className="space-y-1 p-4">
        <div className="space-y-4">
          {SidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex flex-col space-y-0.5 rounded-lg px-3 py-2 text-sidebar-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </div>
              <span className="text-xs text-muted-foreground pl-8">
                {item.description}
              </span>
            </Link>
          ))}
        </div>
      </nav>
      
      <div className="absolute bottom-4 left-0 w-full px-4">
        <div className="rounded-lg bg-muted p-4 text-center text-sm">
          <p className="text-muted-foreground">ELM327 Emulator Web API</p>
          <p className="text-xs text-muted-foreground mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
