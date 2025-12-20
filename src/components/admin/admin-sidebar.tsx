"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  Image,
  Percent,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Proizvodi",
    href: "/admin/proizvodi",
    icon: Package,
  },
  {
    label: "Kategorije",
    href: "/admin/kategorije",
    icon: FolderTree,
  },
  {
    label: "Brendovi",
    href: "/admin/brendovi",
    icon: Tags,
  },
  {
    label: "Hero Promo",
    href: "/admin/hero-promo",
    icon: Image,
  },
  {
    label: "Specijalne Ponude",
    href: "/admin/specijalne-ponude",
    icon: Percent,
  },
  {
    label: "Porudžbine",
    href: "/admin/porudzbine",
    icon: ShoppingCart,
  },
  {
    label: "Korisnici",
    href: "/admin/korisnici",
    icon: Users,
  },
  {
    label: "Podešavanja",
    href: "/admin/podesavanja",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-lime text-black p-2"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-black border-r border-zinc-800 z-40 transition-transform lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-zinc-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="bg-lime text-black p-2 relative">
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-black" />
              <span className="font-display text-lg leading-none font-bold">HS</span>
            </div>
            <div>
              <span className="font-display text-sm text-white leading-none block tracking-wider">
                HOUSE OF
              </span>
              <span className="font-display text-sm text-lime leading-none block tracking-wider">
                SUPPLEMENTS
              </span>
            </div>
          </Link>
        </div>

        {/* Admin badge */}
        <div className="px-6 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2 text-lime text-xs font-bold uppercase tracking-wider">
            <Zap className="h-4 w-4" />
            Admin Panel
          </div>
        </div>

        <nav className="mt-2 px-3">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 my-1 text-sm font-medium transition-all",
                  isActive
                    ? "bg-lime text-black"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-lime transition-colors text-sm"
          >
            <LogOut className="h-5 w-5" />
            <span>Nazad na sajt</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
