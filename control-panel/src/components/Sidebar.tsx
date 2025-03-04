"use client";

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
  BookMarked,
  CarFront
} from "lucide-react";

import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const { state } = useSidebar();
  
  return (
    <SidebarRoot>
      <SidebarContent className="flex flex-col h-full bg-zinc-900/95 border-r border-zinc-800/40">
        <SidebarHeader className="border-b border-zinc-800/40 px-6 py-4">
          <div className="flex items-center gap-2">
            <CarFront className="h-6 w-6 text-primary animate-pulse-glow" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-zinc-100">ELM327</span>
              <span className="text-sm font-medium text-zinc-400">Emulator Web API</span>
            </div>
          </div>
        </SidebarHeader>
        
        <ScrollArea className="flex-1 px-3">
          <SidebarMenu className="gap-1 py-4">
            {SidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "w-full transition-all duration-200",
                        "hover:bg-zinc-800/80 hover:text-zinc-100",
                        "group flex flex-col gap-1 rounded-lg px-3 py-2.5",
                        "border border-transparent",
                        isActive && "bg-zinc-800 border-zinc-700/50 shadow-sm"
                      )}
                    >
                      <a className="flex items-start gap-3">
                        <item.icon className={cn(
                          "h-5 w-5 shrink-0 mt-0.5",
                          isActive ? "text-primary" : "text-zinc-400",
                          "group-hover:text-primary transition-colors"
                        )} />
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="font-medium leading-none text-zinc-100">
                            {item.title}
                          </span>
                          <span className={cn(
                            "text-sm leading-none",
                            isActive ? "text-zinc-300" : "text-zinc-500",
                            "group-hover:text-zinc-300 transition-colors"
                          )}>
                            {item.description}
                          </span>
                        </div>
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </ScrollArea>

        <SidebarFooter className="border-t border-zinc-800/40 bg-zinc-900/50">
          <div className="p-4 flex flex-col gap-3">
            <div>
              <h4 className="text-sm font-medium text-zinc-100">ELM327 Emulator</h4>
              <p className="text-sm text-zinc-400">Developed with ❤️</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-start gap-2 h-8 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-100"
              onClick={() => window.open("https://github.com/rakshitbharat/ELM327-emulator-web-API", "_blank")}
            >
              <Github className="h-4 w-4" />
              Star on GitHub
            </Button>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </SidebarRoot>
  );
}
