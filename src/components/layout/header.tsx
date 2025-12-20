"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  MapPin,
  Phone,
  Zap,
  Heart,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Proteini",
    slug: "proteini",
    subcategories: [
      { name: "Whey Protein", slug: "whey-protein" },
      { name: "Whey Izolat", slug: "whey-izolat" },
      { name: "Kazein", slug: "kazein" },
      { name: "Veganski Proteini", slug: "veganski-proteini" },
      { name: "Beef Protein", slug: "beef-protein" },
    ],
  },
  {
    name: "Aminokiseline",
    slug: "aminokiseline",
    subcategories: [
      { name: "BCAA", slug: "bcaa" },
      { name: "EAA", slug: "eaa" },
      { name: "Glutamin", slug: "glutamin" },
      { name: "L-Karnitin", slug: "l-karnitin" },
    ],
  },
  {
    name: "Kreatin",
    slug: "kreatin",
    subcategories: [
      { name: "Kreatin Monohidrat", slug: "kreatin-monohidrat" },
      { name: "Kreatin Kompleksi", slug: "kreatin-kompleksi" },
    ],
  },
  {
    name: "Vitamini",
    slug: "vitamini",
    subcategories: [
      { name: "Multivitamini", slug: "multivitamini" },
      { name: "Vitamin D", slug: "vitamin-d" },
      { name: "Omega 3", slug: "omega-3" },
      { name: "Magnezijum", slug: "magnezijum" },
    ],
  },
  {
    name: "Pre-Workout",
    slug: "pre-workout",
    subcategories: [],
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar - aggressive style */}
      <div className="bg-black border-b border-zinc-800 py-2 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <a
                href="tel:0644142678"
                className="flex items-center gap-1.5 text-zinc-400 hover:text-lime transition-colors group"
              >
                <MapPin className="h-3.5 w-3.5 text-lime" />
                <span className="hidden sm:inline">Bulevar Oslobođenja 63</span>
                <span className="text-zinc-600 mx-1">|</span>
                <Phone className="h-3.5 w-3.5" />
                <span className="group-hover:text-lime">064/4142-678</span>
              </a>
              <a
                href="tel:0654024444"
                className="flex items-center gap-1.5 text-zinc-400 hover:text-lime transition-colors group"
              >
                <MapPin className="h-3.5 w-3.5 text-lime" />
                <span className="hidden sm:inline">Vojvode Stepe 353</span>
                <span className="text-zinc-600 mx-1">|</span>
                <Phone className="h-3.5 w-3.5" />
                <span className="group-hover:text-lime">065/40-24-444</span>
              </a>
            </div>
            <div className="flex items-center gap-2 text-lime font-bold uppercase text-xs tracking-wider">
              <Zap className="h-4 w-4 animate-pulse" />
              <span className="hidden md:inline">
                Besplatna dostava za porudžbine preko 4.000 RSD
              </span>
              <span className="md:hidden">Free shipping &gt;4000 RSD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header - dark and bold */}
      <div className="bg-zinc-950 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo - aggressive style */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="bg-lime text-black p-2 font-display text-2xl leading-none transition-all group-hover:shadow-[0_0_20px_rgba(204,255,0,0.5)]">
                    HS
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-lime/30" />
                </div>
                <div className="hidden sm:block">
                  <span className="font-display text-xl text-white leading-none block tracking-wider">
                    HOUSE OF
                  </span>
                  <span className="font-display text-xl text-lime leading-none block tracking-wider">
                    SUPPLEMENTS
                  </span>
                </div>
              </div>
            </Link>

            {/* Search bar - industrial style */}
            <div className="flex-1 max-w-xl hidden md:block">
              <div className="relative group">
                <Input
                  type="search"
                  placeholder="Pretraži proizvode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 h-11 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-lime focus:ring-lime/20 rounded-none"
                />
                <Button
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11 bg-lime hover:bg-lime-500 text-black rounded-none"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Actions - minimal and bold */}
            <div className="flex items-center gap-1">
              <Link href="/lista-zelja" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-lime hover:bg-zinc-800"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-400 hover:text-lime hover:bg-zinc-800"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-zinc-900 border-zinc-700 text-white"
                >
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 hover:text-lime focus:text-lime">
                    <Link href="/login">Prijavi se</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 hover:text-lime focus:text-lime">
                    <Link href="/registracija">Registruj se</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-700" />
                  <DropdownMenuItem asChild className="hover:bg-zinc-800 focus:bg-zinc-800 hover:text-lime focus:text-lime">
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/korpa">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-zinc-400 hover:text-lime hover:bg-zinc-800"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-none p-0 flex items-center justify-center text-xs bg-lime text-black font-bold border-0">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-zinc-400 hover:text-lime hover:bg-zinc-800"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <Input
                type="search"
                placeholder="Pretraži proizvode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 h-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 rounded-none"
              />
              <Button
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 bg-lime text-black rounded-none"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation - aggressive industrial */}
        <nav className="bg-black hidden md:block border-t border-zinc-800">
          <div className="container mx-auto px-4">
            <ul className="flex items-center">
              <li>
                <Link
                  href="/"
                  className="block px-5 py-3.5 font-bold text-sm uppercase tracking-wider text-white hover:text-lime hover:bg-zinc-900 transition-colors"
                >
                  Naslovna
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug} className="relative group">
                  <Link
                    href={`/kategorija/${category.slug}`}
                    className="flex items-center gap-1.5 px-5 py-3.5 font-bold text-sm uppercase tracking-wider text-white hover:text-lime hover:bg-zinc-900 transition-colors"
                  >
                    {category.name}
                    {category.subcategories.length > 0 && (
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <div className="absolute left-0 top-full bg-zinc-900 border border-zinc-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[220px] z-50">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/kategorija/${category.slug}/${sub.slug}`}
                          className="block px-5 py-3 text-zinc-300 hover:bg-black hover:text-lime transition-colors border-l-2 border-transparent hover:border-lime"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/akcije"
                  className="block px-5 py-3.5 font-bold text-sm uppercase tracking-wider text-lime hover:bg-zinc-900 transition-colors relative"
                >
                  <span className="relative">
                    Akcije
                    <span className="absolute -top-1 -right-3 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden bg-zinc-950 border-t border-zinc-800 overflow-hidden transition-all duration-300",
            isMenuOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0"
          )}
        >
          <nav className="container mx-auto px-4 py-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className="block py-3 font-bold uppercase tracking-wider text-white hover:text-lime border-l-2 border-transparent hover:border-lime pl-4 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Naslovna
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/kategorija/${category.slug}`}
                    className="block py-3 font-bold uppercase tracking-wider text-white hover:text-lime border-l-2 border-transparent hover:border-lime pl-4 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <ul className="ml-4 space-y-1 border-l border-zinc-800">
                      {category.subcategories.map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/kategorija/${category.slug}/${sub.slug}`}
                            className="block py-2 pl-4 text-zinc-400 hover:text-lime transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/akcije"
                  className="block py-3 font-bold uppercase tracking-wider text-lime border-l-2 border-lime pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Akcije
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
