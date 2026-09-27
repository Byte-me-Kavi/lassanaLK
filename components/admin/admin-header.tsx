"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, LogOut, LayoutDashboard, Package, ShoppingBag, FolderTree, MessageSquare, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ADMIN_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  MessageSquare,
  Settings,
};

export function AdminHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border/40 bg-white sticky top-0 z-30">
      <div className="flex items-center gap-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger 
            render={
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-brand-purple" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-brand-cream/50">
            <div className="h-16 flex items-center px-6 border-b border-border/40 bg-white">
              <Link href="/portal" className="font-heading text-xl font-bold text-brand-purple" onClick={() => setOpen(false)}>
                Lassana<span className="text-brand-gold">LK</span> Admin
              </Link>
            </div>
            <div className="py-6 px-4 space-y-1">
              {ADMIN_NAV_LINKS.map((link) => {
                const Icon = iconMap[link.icon] || LayoutDashboard;
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-brand-purple text-white shadow-sm"
                        : "text-muted-foreground hover:bg-brand-purple/10 hover:text-brand-purple"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/40 bg-white">
              <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </SheetContent>
        </Sheet>
        
        <Link href="/portal" className="font-heading text-lg font-bold text-brand-purple">
          Admin
        </Link>
      </div>

      <div className="flex-1 flex justify-center max-w-md mx-auto hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search orders, products..." 
            className="pl-9 bg-brand-cream/30 border-border/40 focus-visible:ring-brand-purple h-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-brand-purple hidden sm:flex">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-sm font-bold ml-2">
          A
        </div>
      </div>
    </header>
  );
}
