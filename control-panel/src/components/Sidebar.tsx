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
  CarFront,
  PanelLeftIcon,
  Globe,
  LayoutDashboard,
  File
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
    title: "API Tester",
    icon: Globe,
    href: "/",
    description: "Test API endpoints directly"
  },
  {
    title: "Control Panel",
    icon: LayoutDashboard,
    href: "/control-panel",
    description: "Manage emulator settings"
  },
  {
    title: "Documentation",
    icon: File,
    href: "/docs",
    description: "View API documentation"
  },
  {
    title: "Dashboard",
    icon: Gauge,
    href: "/dashboard",
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
    href: "/documentation",
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
  const { state, toggle: toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  return (
    <SidebarRoot>
      <SidebarContent className={cn(
        "flex flex-col h-full bg-zinc-900/95 border-r border-zinc-800/40",
        "transition-all duration-300",
        isCollapsed ? "w-[4rem]" : "w-[280px]"
      )}>
        <SidebarHeader className="border-b border-zinc-800/40 px-4 py-4">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <CarFront className="h-6 w-6 text-primary animate-pulse-glow" />
                <div className="flex flex-col">
                  <span className="text-lg font-semibold tracking-tight text-white">ELM327</span>
                  <span className="text-sm font-medium text-zinc-200">Emulator</span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-zinc-400 hover:text-white"
            >
              <PanelLeftIcon className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )} />
            </Button>
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
                        "hover:bg-zinc-800 hover:text-white",
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5",
                        "border border-transparent",
                        isActive && "bg-zinc-800 border-zinc-700 shadow-sm"
                      )}
                    >
                      <a className="flex items-center gap-3 min-w-0">
                        <item.icon className={cn(
                          "h-5 w-5 shrink-0",
                          isActive ? "text-primary" : "text-zinc-400",
                          "group-hover:text-primary transition-colors"
                        )} />
                        {!isCollapsed && (
                          <div className="flex flex-col gap-1 flex-1 overflow-hidden">
                            <span className="font-medium leading-none text-white truncate">
                              {item.title}
                            </span>
                            <span className={cn(
                              "text-sm leading-none truncate",
                              isActive ? "text-zinc-200" : "text-zinc-300",
                              "group-hover:text-zinc-100 transition-colors"
                            )}>
                              {item.description}
                            </span>
                          </div>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </ScrollArea>

        <SidebarFooter className="border-t border-zinc-800/40 bg-zinc-900/50">
          <div className={cn(
            "p-4 flex flex-col gap-3",
            isCollapsed && "items-center"
          )}>
            {!isCollapsed && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-white">ELM327 Emulator</h4>
                  <p className="text-sm text-zinc-200">Developed with ❤️</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start gap-2 h-8 bg-zinc-800 hover:bg-zinc-700 text-white"
                  onClick={() => window.open("https://github.com/rakshitbharat/ELM327-emulator-web-API", "_blank")}
                >
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </Button>
              </>
            )}
          </div>
        </SidebarFooter>
      </SidebarContent>
    </SidebarRoot>
  );
}
