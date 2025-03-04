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
      <SidebarContent className="flex flex-col h-full bg-gradient-to-b from-background via-background/95 to-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarHeader className="border-b border-border/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <CarFront className="h-6 w-6 text-primary animate-pulse-glow" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-primary">ELM327</span>
              <span className="text-xs font-medium text-muted-foreground">Emulator Web API</span>
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
                        "hover:bg-accent/50 active:bg-accent",
                        "group flex flex-col gap-1 rounded-lg px-3 py-2.5",
                        "border border-transparent",
                        isActive && "bg-accent/50 border-border/50 shadow-sm"
                      )}
                    >
                      <a className="flex items-start gap-3">
                        <item.icon className={cn(
                          "h-5 w-5 shrink-0 mt-0.5",
                          isActive ? "text-primary" : "text-muted-foreground/70",
                          "group-hover:text-primary/80 transition-colors"
                        )} />
                        <div className="flex flex-col gap-1 min-w-0">
                          <span className="font-medium leading-none truncate">{item.title}</span>
                          <span className={cn(
                            "text-xs leading-none truncate",
                            isActive ? "text-muted-foreground" : "text-muted-foreground/60",
                            "group-hover:text-muted-foreground transition-colors"
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

        <SidebarFooter className="border-t border-border/50 bg-muted/20 backdrop-blur supports-[backdrop-filter]:bg-background/40">
          <div className="p-4 flex flex-col gap-3">
            <div>
              <h4 className="text-sm font-medium">ELM327 Emulator</h4>
              <p className="text-xs text-muted-foreground">Developed with ❤️</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-start gap-2 h-8"
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
