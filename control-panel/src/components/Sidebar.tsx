import Link from "next/link";
import { Gauge, BookOpen, FileText, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarItems = [
  {
    title: "Dashboard",
    icon: Gauge,
    href: "/",
  },
  {
    title: "GitHub Repo",
    icon: Info,
    href: "https://github.com/your-repo",
  },
  {
    title: "Repo Documentation",
    icon: BookOpen,
    href: "/docs",
  },
  {
    title: "API Docs",
    icon: FileText,
    href: "/api-docs",
  },
  // Add more items as needed
];

export function Sidebar() {
  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">ELM327 Emulator</h2>
      </div>
      <nav className="space-y-1 p-4">
        {SidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
