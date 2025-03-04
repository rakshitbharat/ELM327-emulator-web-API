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

import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <SidebarRoot>
      <SidebarContent className="flex flex-col h-full">
        <SidebarHeader>
          <div className="flex h-14 items-center px-4 font-semibold">
            <span className="text-lg">ELM327 Emulator</span>
          </div>
        </SidebarHeader>
        
        <ScrollArea className="flex-1">
          <SidebarMenu>
            {SidebarItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton asChild>
                    <a className="w-full flex items-center">
                      <item.icon className="h-4 w-4 mr-2" />
                      <div className="flex flex-col flex-1">
                        <span>{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>

        <SidebarFooter className="border-t">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium">ELM327 Emulator</p>
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </SidebarRoot>
  );
}
