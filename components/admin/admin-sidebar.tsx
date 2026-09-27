"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_LINKS } from "@/lib/constants";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  MessageSquare,
  Settings,
};

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-col border-r border-border/40 bg-brand-cream/30 hidden lg:flex h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border/40 shrink-0">
        <Link href="/portal" className="font-heading text-xl font-bold text-brand-purple">
          Lassana<span className="text-brand-gold">LK</span> Admin
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = iconMap[link.icon] || LayoutDashboard;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-brand-purple text-white shadow-sm"
                    : "text-muted-foreground hover:bg-brand-purple/10 hover:text-brand-purple"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-muted-foreground")} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border/40 shrink-0">
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
