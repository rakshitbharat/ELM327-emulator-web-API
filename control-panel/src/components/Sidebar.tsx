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
      <SidebarContent className="flex flex-col h-full bg-gradient-to-b from-background/90 to-background border-r">
        <SidebarHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <CarFront className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">ELM327</span>
              <span className="text-xs text-muted-foreground">Emulator Web API</span>
            </div>
          </div>
        </SidebarHeader>
        
        <ScrollArea className="flex-1 px-4">
          <SidebarMenu className="gap-2 py-4">
            {SidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "w-full transition-colors duration-200",
                        "hover:bg-accent/50 active:bg-accent",
                        "group flex flex-col gap-1 rounded-lg px-3 py-2",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      <a className="flex items-start gap-3">
                        <item.icon className={cn(
                          "h-5 w-5 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground",
                          "group-hover:text-primary transition-colors"
                        )} />
                        <div className="flex flex-col gap-1">
                          <span className="font-medium leading-none">{item.title}</span>
                          <span className={cn(
                            "text-xs leading-none",
                            isActive ? "text-accent-foreground/70" : "text-muted-foreground",
                            "group-hover:text-accent-foreground/70 transition-colors"
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

        <SidebarFooter className="border-t bg-muted/50">
          <div className="p-4 flex flex-col gap-2">
            <div>
              <h4 className="text-sm font-semibold">ELM327 Emulator</h4>
              <p className="text-xs text-muted-foreground">Developed with ❤️</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-start"
              onClick={() => window.open("https://github.com/rakshitbharat/ELM327-emulator-web-API", "_blank")}
            >
              <Github className="mr-2 h-4 w-4" />
              Star on GitHub
            </Button>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </SidebarRoot>
  );
}
